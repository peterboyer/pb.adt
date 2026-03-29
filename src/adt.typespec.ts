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

	Expect<Equal<ADT.Keys<None>, string>>,
	Expect<Equal<ADT.Keys<Unit>, "Unit">>,
	Expect<Equal<ADT.Keys<Data>, "Data">>,
	Expect<Equal<ADT.Keys<Both>, "Unit" | "Data">>,

	Expect<Equal<ADT.Pick<None, never>, never>>,
	Expect<Equal<ADT.Pick<Unit, never>, never>>,
	Expect<Equal<ADT.Pick<Unit, "Unit">, Unit>>,
	Expect<Equal<ADT.Pick<Data, never>, never>>,
	Expect<Equal<ADT.Pick<Data, "Data">, Data>>,
	Expect<Equal<ADT.Pick<Both, never>, never>>,
	Expect<Equal<ADT.Pick<Both, "Unit">, Unit>>,
	Expect<Equal<ADT.Pick<Both, "Data">, Data>>,
	Expect<Equal<ADT.Pick<Both, "Unit" | "Data">, Both>>,

	Expect<Equal<ADT.Omit<None, never>, None>>,
	Expect<Equal<ADT.Omit<Unit, never>, Unit>>,
	Expect<Equal<ADT.Omit<Unit, "Unit">, never>>,
	Expect<Equal<ADT.Omit<Data, never>, Data>>,
	Expect<Equal<ADT.Omit<Data, "Data">, never>>,
	Expect<Equal<ADT.Omit<Both, never>, Both>>,
	Expect<Equal<ADT.Omit<Both, "Unit">, Data>>,
	Expect<Equal<ADT.Omit<Both, "Data">, Unit>>,
	Expect<Equal<ADT.Omit<Both, "Unit" | "Data">, never>>,
];

{
	type State = ADT<"None"> | ADT<"Left" | "Right", { value: string }>;

	const getState = (): State => {
		if ("".toString()) return ADT<State>().Left({ value: "" });
		if ("".toString()) return ADT<State>().Right({ value: "" });
		return ADT<ReturnType<typeof getState>>().None;
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
	const ping = ADT<Post>().Ping;
	void ping;
}

{
	const Post = ADT<Post>();

	const ping = Post.Ping;
	void ping;

	const text = Post.Text({ body: "" });
	void text;
}

{
	const posts: Post[] = [
		ADT<Post>().Ping,
		ADT<Post>().Text({ body: "Hello, World!" }),
		ADT<Post>().Photo({ url: "https://example.com/image.jpg" }),
	];
	void posts;
}

{
	const a: ADT<"Test", { body: string }> = ADT<typeof a>().Test({ body: "" });
	void a;
}
