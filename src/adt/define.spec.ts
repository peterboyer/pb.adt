import { z } from "zod";
import { ADT } from "../micro.js";
import type { Equal, Expect } from "pb.expectequal";

const value = "...";

test("Define", () => {
	type Event = ADT<"Open"> | ADT<"Data", { value: unknown }> | ADT<"Close">;
	const Event = ADT<Event>();

	const Ready = Event.Open();
	!0 as Expect<Equal<typeof Ready, { $type: "Open" }>>;
	const Data = Event.Data({ value });
	!0 as Expect<Equal<typeof Data, { $type: "Data"; value: unknown }>>;
	const Close = Event.Close();
	!0 as Expect<Equal<typeof Close, { $type: "Close" }>>;

	{
		expect(Event.Open()).toStrictEqual({ $type: "Open" });
		// @ts-expect-error Data requires 1 argument.
		expect(Event.Data()).toStrictEqual({ $type: "Data", value });
		expect(Event.Data({ value })).toStrictEqual({ $type: "Data", value });
		expect(Event.Close()).toStrictEqual({ $type: "Close" });
	}
});

test("Define with all properties optional", () => {
	type Event = ADT<"Ready"> | ADT<"Error", { value?: unknown }>;
	const Event = ADT<Event>();

	const Ready = Event.Ready();
	!0 as Expect<Equal<typeof Ready, { $type: "Ready" }>>;
	const Error = Event.Error();
	!0 as Expect<Equal<typeof Error, { $type: "Error"; value?: unknown }>>;

	expect(Event.Ready()).toStrictEqual({ $type: "Ready" });
	expect(Event.Error()).toStrictEqual({ $type: "Error" });
	expect(Event.Error({})).toStrictEqual({ $type: "Error" });
	expect(Event.Error({ value })).toStrictEqual({ $type: "Error", value });
});

test("Define using Zod infer type and extend constructor", () => {
	const EventSchema = z.union([
		z.object({
			$type: z.literal("Open"),
		}),
		z.object({
			$type: z.literal("Data"),
			value: z.unknown(),
		}),
		z.object({
			$type: z.literal("Close"),
		}),
	]);

	type Event = z.infer<typeof EventSchema>;

	{
		const Event = Object.assign(new Proxy(ADT<Event>(), {}), {
			$schema: EventSchema,
		});

		const Ready = Event.Open();
		!0 as Expect<Equal<typeof Ready, { $type: "Open" }>>;
		const Data = Event.Data({ value });
		// NOTE: `value` is optional because of bug with z.infer.
		// Incorrectly infers `z.unknown()` as optional property of object.
		!0 as Expect<Equal<typeof Data, { $type: "Data"; value?: unknown }>>;
		const Close = Event.Close();
		!0 as Expect<Equal<typeof Close, { $type: "Close" }>>;

		expect(Event.$schema).toBe(EventSchema);
		expect(Event.Open()).toEqual({ $type: "Open" });
		expect(Event.Data({ value: 1 })).toEqual({ $type: "Data", value: 1 });
	}
});
