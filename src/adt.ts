import type { Identity } from "./adt/identity.js";
import type { Intersect } from "./adt/intersect.js";

////////////////////////////////////////////////////////////////////////////////

export type ADT<
	TType extends string = string,
	TData extends Record<string, unknown> = never,
> = [TData] extends [never]
	? TType extends infer UType
		? { $type: UType }
		: never
	: TType extends infer U
		? Identity<{ $type: U } & TData>
		: never;

////////////////////////////////////////////////////////////////////////////////

// @ts-ignore
export function ADT<T extends ADT>(): Mapper<T>;
export function ADT<T>(value: T): value is Extract<T, ADT<string>>;
export function ADT<T>(...args: [] | [value: unknown]) {
	if (args.length === 1) {
		const value = args[0];
		if (!value) return false;
		if (typeof value !== "object") return false;
		if (!("$type" in value)) return false;
		if (typeof value.$type !== "string") return false;
		return true;
	}

	return mapper;
}

////////////////////////////////////////////////////////////////////////////////

type Mapper<T extends ADT = ADT> = Identity<
	Intersect<
		T extends { $type: string }
			? [Exclude<keyof T, "$type">] extends [never]
				? {
						// Unit variant.
						[Key in T["$type"]]: () => T;
					}
				: {
						// Data variant.
						[Key in T["$type"]]: (
							...args: Record<never, never> extends Omit<T, "$type">
								? // Data variant without required properties.
									[data?: Identity<Omit<T, "$type">>]
								: // Data Variant with required properties.
									[data: Identity<Omit<T, "$type">>]
						) => T;
					}
			: never
	>
>;

////////////////////////////////////////////////////////////////////////////////

const mapper = new Proxy({} as Mapper, {
	get(_, type: string) {
		const cached = cache[type];
		if (cached) {
			return cached;
		}

		const fn = (data?: Record<string, unknown>) => ({ $type: type, ...data });
		return (cache[type] = fn);
	},
});

const cache: Partial<Record<string, Function>> = {};
