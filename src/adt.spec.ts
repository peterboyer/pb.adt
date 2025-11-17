import { ADT } from "./adt.js";

type Test =
	| ADT<"Unit">
	| ADT<"Data", { value: string }>
	| ADT<"Maybe", { value?: number }>;

const Test = ADT<Test>();

test.each<[value: unknown, results: unknown]>([
	[Test.Unit(), { $type: "Unit" }],
	[Test.Data({ value: "..." }), { $type: "Data", value: "..." }],
	[Test.Maybe(), { $type: "Maybe" }],
	[Test.Maybe({ value: 123 }), { $type: "Maybe", value: 123 }],

	[ADT<Test>().Unit(), { $type: "Unit" }],
	[ADT<Test>().Data({ value: "..." }), { $type: "Data", value: "..." }],
	[ADT<Test>().Maybe(), { $type: "Maybe" }],
	[ADT<Test>().Maybe({ value: 123 }), { $type: "Maybe", value: 123 }],
])("$0 => $1", (value, results) => {
	expect(value).toStrictEqual(results);
});
