import type { Identity } from "./shared/identity.js";

export type ADT<TType, TData = never> = [TData] extends [never]
	? { $type: TType }
	: Identity<{ $type: TType } & TData>;

export function ADT<const T>(
	...args: T extends { $type: string }
		? [Exclude<keyof T, "$type">] extends [never]
			? [type: T["$type"]]
			: [type: T["$type"], data: Omit<T, "$type">]
		: never
): T {
	return { $type: args[0], ...args[1] } as any;
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
	const text: Post = ADT("Text", { body: "" });
	void text;
}

{
	const photo: Post = ADT("Photo", { url: "" });
	void photo;
}

function test(type: "Ping"): Post;
function test(type: "Text", data: { body: string; title?: string }): Post;
function test(type: "Photo" | "Video", data: { url: string }): Post;
function test(type: string, data?: object): Post {
	return { $type: type, ...data } as any;
}

{
	const ping: Post = test("Ping");
	void ping;
}

{
	const text: Post = test("Photo", { body: "" });
	void text;
}
