import type { Equal, Expect } from "pb.types";
import { ADT } from "./adt.js";

type Test =
	| ADT<"Unit">
	| ADT<"Data", { value: string }>
	| ADT<"Maybe", { value?: number }>;

const Test = ADT<Test>();

describe("ADT as Mapper", () => {
	test.each<[value: any, results: any]>([
		[Test.Unit, { $type: "Unit" }],
		[ADT<Test>().Unit, { $type: "Unit" }],
	])("Unit $0 => $1", (value, results) => {
		expect(value.$type).toBe(results.$type);
	});

	test.each<[value: any, results: any]>([
		[Test.Data({ value: "..." }), { $type: "Data", value: "..." }],
		[ADT<Test>().Data({ value: "..." }), { $type: "Data", value: "..." }],

		[Test.Maybe(), { $type: "Maybe" }],
		[ADT<Test>().Maybe(), { $type: "Maybe" }],

		[Test.Maybe({ value: 123 }), { $type: "Maybe", value: 123 }],
		[ADT<Test>().Maybe({ value: 123 }), { $type: "Maybe", value: 123 }],
	])("Data $0 => $1", (value, results) => {
		expect(value).toStrictEqual(results);
	});

	test("Cache", () => {
		expect(Test.Unit).toBe(Test.Unit);
	});
});

describe("ADT as Type Guard", () => {
	test("Type", () => {
		const value = {} as string | Test;
		if (ADT(value)) {
			!0 as Expect<Equal<typeof value, Test>>;
		} else {
			!0 as Expect<Equal<typeof value, string>>;
		}
	});

	test.each<[value: unknown, result: boolean]>([
		["...", false],
		[Test.Unit, true],
		[Test.Data({ value: "..." }), true],
	])("If $0 => $1", (value, result) => {
		expect(ADT(value)).toBe(result);
	});
});
