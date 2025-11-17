import { ADT } from "./adt.js";

import type { Expect, Equal } from "pb.types";

type ENone = ADT;
type EUnit = ADT<"Unit">;
type EData = ADT<"Data", { value: unknown }>;
type EBoth = EUnit | EData;

// prettier-ignore
({}) as [
	Expect<Equal<ENone, ADT>>,
	Expect<Equal<ENone["$type"], string>>,
	Expect<Equal<EUnit, { $type: "Unit" }>>,
	Expect<Equal<EUnit["$type"], "Unit">>,
	Expect<Equal<EData, { $type: "Data"; value: unknown }>>,
	Expect<Equal<EData["$type"], "Data">>,
	Expect<Equal<EBoth, { $type: "Unit" } | { $type: "Data"; value: unknown }>>,
	Expect<Equal<EBoth["$type"], "Unit" | "Data">>,

	Expect<Equal<ADT.Keys<ENone>, string>>,
	Expect<Equal<ADT.Keys<EUnit>, "Unit">>,
	Expect<Equal<ADT.Keys<EData>, "Data">>,
	Expect<Equal<ADT.Keys<EBoth>, "Unit" | "Data">>,

	Expect<Equal<ADT.Pick<ENone, never>, never>>,
	Expect<Equal<ADT.Pick<EUnit, never>, never>>,
	Expect<Equal<ADT.Pick<EUnit, "Unit">, EUnit>>,
	Expect<Equal<ADT.Pick<EData, never>, never>>,
	Expect<Equal<ADT.Pick<EData, "Data">, EData>>,
	Expect<Equal<ADT.Pick<EBoth, never>, never>>,
	Expect<Equal<ADT.Pick<EBoth, "Unit">, EUnit>>,
	Expect<Equal<ADT.Pick<EBoth, "Data">, EData>>,
	Expect<Equal<ADT.Pick<EBoth, "Unit" | "Data">, EBoth>>,

	Expect<Equal<ADT.Omit<ENone, never>, ENone>>,
	Expect<Equal<ADT.Omit<EUnit, never>, EUnit>>,
	Expect<Equal<ADT.Omit<EUnit, "Unit">, never>>,
	Expect<Equal<ADT.Omit<EData, never>, EData>>,
	Expect<Equal<ADT.Omit<EData, "Data">, never>>,
	Expect<Equal<ADT.Omit<EBoth, never>, EBoth>>,
	Expect<Equal<ADT.Omit<EBoth, "Unit">, EData>>,
	Expect<Equal<ADT.Omit<EBoth, "Data">, EUnit>>,
	Expect<Equal<ADT.Omit<EBoth, "Unit" | "Data">, never>>,
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
