import { ADT } from "./adt.js";

type WebEvent =
	| ADT<"PageLoad" | "PageUnload">
	| ADT<"KeyPress", { key: string }>
	| ADT<"Paste", { content: string }>
	| ADT<"Click", { x: number; y: number }>;

const WebEvent = ADT<WebEvent>();

void function inspect(event: WebEvent): string | undefined {
	switch (event.$type) {
		case "PageLoad":
			return void console.log(event);
		case "PageUnload":
			return void console.log(event);
		case "KeyPress":
			return void console.log(event, event.key);
		case "Paste":
			return void console.log(event, event.content);
		case "Click":
			return void console.log(event, event.x, event.y);
		default:
			const _$: never = event;
			return void _$;
	}
};

function getWebEvent(): WebEvent | ADT<"None"> {
	if ("".toString()) return WebEvent.PageLoad();
	if ("".toString()) return WebEvent.PageUnload();
	if ("".toString()) return WebEvent.KeyPress({ key: "x" });
	if ("".toString()) return WebEvent.Paste({ content: "..." });
	if ("".toString()) return WebEvent.Click({ x: 10, y: 10 });
	return ADT<ReturnType<typeof getWebEvent>>().None();
}

void function app() {
	const event = getWebEvent();

	if (event.$type === "None") {
		return;
	}

	return (() => {
		switch (event.$type) {
			case "PageLoad":
				return "load" as const;
			case "PageUnload":
				return "unload" as const;
			default:
				return undefined;
		}
	})();
};
