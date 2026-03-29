import { ADT } from "./adt.js";

import type { Expect, Equal } from "pb.types";

type None = ADT;
type Unit = ADT<"Unit">;
type Data = ADT<"Data", { value: unknown }>;
type Both = Unit | Data;

// prettier-ignore
({}) as [
	Expect<Equal<None, ADT>>,
	Expect<Equal<None["$type"], string>>,
	Expect<Equal<Unit, { $type: "Unit" }>>,
	Expect<Equal<Unit["$type"], "Unit">>,
	Expect<Equal<Data, { $type: "Data"; value: unknown }>>,
	Expect<Equal<Data["$type"], "Data">>,
	Expect<Equal<Both, { $type: "Unit" } | { $type: "Data"; value: unknown }>>,
	Expect<Equal<Both["$type"], "Unit" | "Data">>,

	Expect<Equal<None["$type"], string>>,
	Expect<Equal<Unit["$type"], "Unit">>,
	Expect<Equal<Data["$type"], "Data">>,
	Expect<Equal<Both["$type"], "Unit" | "Data">>,

	Expect<Equal<Extract<Unit, ADT<"Unit">>, Unit>>,
	Expect<Equal<Extract<Data, ADT<"Data">>, Data>>,
	Expect<Equal<Extract<Both, ADT<"Unit">>, Unit>>,
	Expect<Equal<Extract<Both, ADT<"Data">>, Data>>,
	Expect<Equal<Extract<Both, ADT<"Unit"> | ADT<"Data">>, Both>>,

	Expect<Equal<Exclude<Unit, ADT<"Unit">>, never>>,
	Expect<Equal<Exclude<Data, ADT<"Data">>, never>>,
	Expect<Equal<Exclude<Both, ADT<"Unit">>, Data>>,
	Expect<Equal<Exclude<Both, ADT<"Data">>, Unit>>,
	Expect<Equal<Exclude<Both, ADT<"Unit"> | ADT<"Data">>, never>>,
];

{
	type State = ADT<"None"> | ADT<"Left" | "Right", { value: string }>;

	const getState = (): State => {
		if ("".toString()) return ADT<State>().Left({ value: "" });
		if ("".toString()) return ADT<State>().Right({ value: "" });
		return ADT<ReturnType<typeof getState>>().None();
	};

	() => {
		const state = getState();

		if (state.$type === "Left") {
			({}) as [Expect<Equal<typeof state, { $type: "Left"; value: string }>>];
			return;
		}
		if (state.$type === "Right") {
			({}) as [Expect<Equal<typeof state, { $type: "Right"; value: string }>>];
			return;
		}
		if (state.$type === "None") {
			({}) as [Expect<Equal<typeof state, { $type: "None" }>>];
			return;
		}

		({}) as [Expect<Equal<typeof state, never>>];
	};
}

type Post =
	| ADT<"Ping">
	| ADT<
			"Text",
			{
				/**
				 * Body of the text post.
				 */
				body: string;
				/**
				 * Optional title of the text post.
				 */
				title?: string;
			}
	  >
	| ADT<
			"Photo" | "Video",
			{
				/**
				 * Full URL to asset.
				 */
				url: string;
			}
	  >;

{
	const ping = ADT<Post>().Ping();
	void ping;
}

{
	const Post = ADT<Post>();

	const ping = Post.Ping();
	void ping;

	const text = Post.Text({ body: "" });
	void text;
}

{
	const posts: Post[] = [
		ADT<Post>().Ping(),
		ADT<Post>().Text({ body: "Hello, World!" }),
		ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
	];
	void posts;
}

{
	const a: ADT<"Test", { body: string }> = ADT<typeof a>().Test({ body: "" });
	void a;
}
