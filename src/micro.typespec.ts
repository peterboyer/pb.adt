import { ADT } from "./micro.js";

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
