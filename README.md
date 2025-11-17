
# Install

```shell
npm install pb.adt
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`

# Quickstart

`ADT` can create discriminated union types.


```ts
import { ADT } from "pb.adt";

{
  type Post =
    | ADT<"Ping">
    | ADT<"Text", { title?: string; body: string }>
    | ADT<"Photo", { url: string }>;
}

```


... which is identical to if you declared it manually.


```ts
{
  type Post =
    | { $type: "Ping" }
    | { $type: "Text"; title?: string; body: string }
    | { $type: "Photo"; url: string };
}
```


As a function `ADT` can return value-typed ease-of-use constructors.


```ts
type Post =
  | ADT<"Ping">
  | ADT<"Text", { title?: string; body: string }>
  | ADT<"Photo", { url: string }>;
const Post = ADT<Post>();
```


Constructors can create ADT variant values:
- All constructed ADT variant values are plain objects.
- They match their variant types exactly.
- They do not have any methods or hidden properties.


```ts
{
  const posts: Post[] = [
    Post.Ping(),
    Post.Text({ body: "Hello, World!" }),
    Post.Photo({ url: "https://example.com/image.jpg" }),
  ];
}
```



```ts
{
  const posts: Post[] = [
    ADT<Post>().Ping(),
    ADT<Post>().Text({ body: "Hello, World!" }),
    ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
  ];
}
```


`ADT` variant values are simple objects, you can narrow and access properties as
you would any other object.


```ts
function PostgetTitle(post: Post): string | undefined {
  return post.$type === "Text" ? post.title : undefined;
}
```


# API

- [`ADT`](#adt)
  - [`ADT.Keys`](#adtkeys)
  - [`ADT.Pick`](#adtpick)
  - [`ADT.Omit`](#adtomit)

## `ADT`

```
(type) ADT<TType, TData?>
```


```ts
{
  type Foo = ADT<"Unit"> | ADT<"Data", { value: string }>;
}
```


```
(func) ADT<T>() => { Unit() => Unit, Data(data) => Data, ... }
```


```ts
type Foo = ADT<"Unit"> | ADT<"Data", { value: string }>;
```


<div align=right><a href=#api>Back to top ⤴</a></div>

## Switch

<details><summary>(<strong>Example</strong>) Handle all cases.</summary>

```ts
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
}
```

</details>

<details><summary>(<strong>Example</strong>) Unhandled cases with fallback.</summary>

```ts
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
}
```

</details>

<details><summary>(<strong>Example</strong>) UI Framework (e.g. React) rendering all state cases.</summary>

```ts
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
```

</details>

<div align=right><a href=#api>Back to top ⤴</a></div>

## `ADT.Keys`

```
(type) ADT.Keys<Tadt, TDiscriminant?>
```
<details><summary>(<strong>Example</strong>) Infers all keys of an ADT's variants.</summary>

```ts
{
  type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
  type Keys = ADT.Keys<T>;
}
// -> "Unit" | "Data"
```

</details>

<div align=right><a href=#api>Back to top ⤴</a></div>

## `ADT.Pick`

```
(type) ADT.Pick<Tadt, TKeys, TDiscriminant?>
```
<details><summary>(<strong>Example</strong>) Pick subset of an ADT's variants by key.</summary>

```ts
{
  type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
  type Variants = ADT.Pick<T, "Unit">;
}
// -> *Unit
```

</details>

<div align=right><a href=#api>Back to top ⤴</a></div>

## `ADT.Omit`

```
(type) ADT.Omit<Tadt, TKeys, TDiscriminant?>
```
<details><summary>(<strong>Example</strong>) Omit subset of an ADT's variants by key.</summary>

```ts
{
  type T = ADT<"Unit"> | ADT<"Data", { value: string }>;
  type Variants = ADT.Omit<T, "Unit">;
}
// -> *Data
</details>

<div align=right><a href=#api>Back to top ⤴</a></div>
