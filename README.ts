/* eslint-disable no-inner-declarations */ //-

//+ # Install

/*!
```shell
npm install pb.adt
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`
!*/

//+ # Quickstart

/*!
`ADT` can create discriminated union types.
!*/

//>
import { ADT } from "pb.adt";

{
	type Post =
		| ADT<"Ping">
		| ADT<"Text", { title?: string; body: string }>
		| ADT<"Photo", { url: string }>;
	void {} as unknown as Post; //-
}

//<

/*!
... which is identical to if you declared it manually.
!*/

//>
{
	type Post =
		| { $type: "Ping" }
		| { $type: "Text"; title?: string; body: string }
		| { $type: "Photo"; url: string };
	void {} as unknown as Post; //-
}
//<

/*!
As a function `ADT` can return value-typed ease-of-use constructors.
!*/

//>
type Post =
	| ADT<"Ping">
	| ADT<"Text", { title?: string; body: string }>
	| ADT<"Photo", { url: string }>;
const Post = ADT<Post>();
//<

/*!
Constructors can create ADT variant values:
- All constructed ADT variant values are plain objects.
- They match their variant types exactly.
- They do not have any methods or hidden properties.
!*/

//>
{
	const posts: Post[] = [
		Post.Ping(),
		Post.Text({ body: "Hello, World!" }),
		Post.Photo({ url: "https://example.com/image.jpg" }),
	];
	void posts; //-
}
//<

//>
{
	const posts: Post[] = [
		ADT<Post>().Ping(),
		ADT<Post>().Text({ body: "Hello, World!" }),
		ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
	];
	void posts; //-
}
//<

/*!
`ADT` variant values are simple objects, you can narrow and access properties as
you would any other object.
!*/

//>
function Post_getTitle(post: Post): string | undefined {
	return post.$type === "Text" ? post.title : undefined;
}
void Post_getTitle; //-
//<

/*!
# API

- [`ADT`](#adt)
	- [`ADT.Keys`](#adtkeys)
	- [`ADT.Pick`](#adtpick)
	- [`ADT.Omit`](#adtomit)
!*/

/*!
## `ADT`

```
(type) ADT<TType, TData?>
```
!*/

//>
{
	type Foo = ADT<"Unit"> | ADT<"Data", { value: string }>;
	void {} as unknown as Foo; //-
}
//<

/*!
```
(func) ADT<T>() => { Unit() => Unit, Data(data) => Data, ... }
```
!*/

//>
type Foo = ADT<"Unit"> | ADT<"Data", { value: string }>;
void {} as unknown as Foo; //-
//<

//backtotop

/*!
## Switch
!*/

//>>> Handle all cases.
//>
{
	const foo = {} as Foo;
	const value = ((): string => {
		switch (foo.$type) {
			case "Unit":
				return "Unit()";
			case "Data":
				return `Data(${foo.value})`;
			default:
				return foo;
		}
	})();
	void value; //-
}
//<
//<<<

//>>> Unhandled cases with fallback.
//>
{
	const foo = {} as Foo;
	const value = ((): string => {
		switch (foo.$type) {
			case "Unit":
				return "Unit()";
			default:
				return "...";
		}
	})();
	void value; //-
}
//<
//<<<

//>>> UI Framework (e.g. React) rendering all state cases.
//>
type Element = any; //-
const useState = <T>(_t: T) => ({}) as [T, (t: T) => void]; //-
const useEffect = (_cb: () => void, _deps: never[]) => undefined; //-
type State =
	| ADT<"Pending">
	| ADT<"Ok", { items: string[] }>
	| ADT<"Error", { cause: Error }>;

const State = ADT<State>();

function Component(): Element {
	const [state, setState] = useState<State>(State.Pending());

	// fetch data and exclusively handle success or error states
	useEffect(() => {
		(async () => {
			const responseResult = await fetch("/items")
				.then((response) => response.json() as Promise<{ items: string[] }>)
				.catch((cause) =>
					cause instanceof Error ? cause : new Error(undefined, { cause }),
				);

			setState(
				responseResult instanceof Error
					? State.Error({ cause: responseResult })
					: State.Ok({ items: responseResult.items }),
			);
		})();
	}, []);

	// exhaustively handle all possible states
	return ((): string => {
		switch (state.$type) {
			case "Pending":
				return `<Spinner />`;
			case "Ok":
				return `<ul>${state.items.map(() => `<li />`)}</ul>`;
			case "Error":
				return `<span>Error: "${state.cause.message}"</span>`;
			default:
				return state;
		}
	})();
}
void Component; //-
//<
//<<<

//backtotop

/*!
## `ADT.Keys`

```
(type) ADT.Keys<Tadt, TDiscriminant?>
```
!*/
//>>> Infers all keys of an ADT's variants.
//>
{
	type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
	type Keys = ADT.Keys<T>;
	void {} as unknown as Keys; //-
}
// -> "Unit" | "Data"
//<
//<<<

//backtotop

/*!
## `ADT.Pick`

```
(type) ADT.Pick<Tadt, TKeys, TDiscriminant?>
```
!*/
//>>> Pick subset of an ADT's variants by key.
//>
{
	type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
	type Variants = ADT.Pick<T, "Unit">;
	void {} as unknown as Variants; //-
}
// -> *Unit
//<
//<<<

//backtotop

/*!
## `ADT.Omit`

```
(type) ADT.Omit<Tadt, TKeys, TDiscriminant?>
```
!*/
//>>> Omit subset of an ADT's variants by key.
//>
{
	type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
	type Variants = ADT.Omit<T, "Unit">;
	void {} as unknown as Variants; //-
}
// -> *Data
//<<<

//backtotop
