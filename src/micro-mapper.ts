import type { Identity } from "./shared/identity.js";
import type { Intersect } from "./shared/intersect.js";

export type ADT<TType, TData = never> = [TData] extends [never]
	? { $type: TType }
	: Identity<{ $type: TType } & TData>;

export const ADT = <T = never>(): ADTMapper<T> => ADT.proxy as any;
ADT.proxy = new Proxy({}, { get: (_, type: string) => ADT.mapper.bind(type) });
ADT.mapper = function (this: string, data: any) {
	return { $type: this, ...data };
};

type ADTMapper<T> = Identity<
	Intersect<
		T extends { $type: string }
			? [Exclude<keyof T, "$type">] extends [never]
				? { [Key in T["$type"]]: () => T }
				: { [Key in T["$type"]]: (data: Identity<Omit<T, "$type">>) => T }
			: never
	>
>;

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
