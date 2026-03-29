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

//>
import { ADT } from "pb.adt";
//<

/*!
As a type, `ADT` can create discriminated union types.
!*/

//>
type Post =
	| ADT<"Ping">
	| ADT<"Text", { title?: string; body: string }>
	| ADT<"Photo" | "Video", { url: string }>;
void {} as unknown as Post; //-
//<

/*!
... which is identical to if you declared it manually.
!*/

//>
type Post_ =
	| { $type: "Ping" }
	| { $type: "Text"; title?: string; body: string }
	| { $type: "Photo"; url: string }
	| { $type: "Video"; url: string };
void {} as unknown as Post_; //-
//<

/*!
As a function, `ADT` can return ease-of-use value-typed constructors.

- All constructed ADT variant values are plain objects.
- They match their variant types exactly.
- They do not have any methods or hidden properties.
!*/

//>
const Post = ADT<Post_>();
//<

//>
const posts: Post[] = [
	Post.Ping(),
	Post.Text({ body: "Hello, World!" }),
	Post.Photo({ url: "https://example.com/image.jpg" }),
	Post.Video({ url: "https://example.com/video.mp4" }),
];
void posts; //-
//<

//>
const posts_: Post[] = [
	ADT<Post>().Ping(),
	ADT<Post>().Text({ body: "Hello, World!" }),
	ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
	ADT<Post>().Video({ url: "https://example.com/video.mp4" }),
];
void posts_; //-
//<

/*!
# Usage

`ADT` variant values are simple objects, you can narrow and access properties as
you would any other object.
!*/

//>
export function getSummary(post: Post): string | undefined {
	if (post.$type === "Text") {
		return post.title;
	}
	if (post.$type === "Photo" || post.$type === "Video") {
		return post.url;
	}
	return undefined;
}
void getSummary; //-
//<

//>>> Handle all cases.
//>
const foo_ = {} as Foo;
const value_ = ((): string => {
	switch (foo_.$type) {
		case "Unit":
			return "Unit()";
		case "Data":
			return `Data(${foo_.value})`;
		default:
			return foo_;
	}
})();
void value_; //-
//<
//<<<

//>>> Unhandled cases with fallback.
//>
const foo__ = {} as Foo;
const value__ = ((): string => {
	switch (foo__.$type) {
		case "Unit":
			return "Unit()";
		default:
			return "...";
	}
})();
void value__; //-
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

export function Component(): Element {
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

/*!
# API

- [`ADT`](#adt)
	- [`ADT.Keys`](#adtkeys)
	- [`ADT.Pick`](#adtpick)
	- [`ADT.Omit`](#adtomit)
!*/

/*!
## `ADT`
!*/

/*!
```
(type) ADT<TType, TData?>
(func) ADT<T>() => { Unit() => Unit, Data(data) => Data, ... }
```
!*/

//>>> Define variants.
//>
type Foo = ADT<"Unit"> | ADT<"Data", { value: string }>;
void {} as unknown as Foo; //-
//<
//<<<

//>>> Create variant values.
//>
const Foo = ADT<Foo>();
const foo = [
	Foo.Unit(),
	Foo.Data({ value: "..." }),
	ADT<Foo>().Unit(),
	ADT<Foo>().Data({ value: "..." }),
];
void foo; //-
//<
//<<<

//backtotop
