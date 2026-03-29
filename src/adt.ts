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

export namespace ADT {
	export type Mapper<T extends ADT = ADT> = Identity<
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
}

////////////////////////////////////////////////////////////////////////////////

// @ts-ignore
export function ADT<T extends ADT>(): ADT.Mapper<T>;
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

const mapper = new Proxy({} as ADT.Mapper, {
	get(_, type: string) {
		const cachedConstructor = cachedConstructor_byType[type];
		if (cachedConstructor) {
			return cachedConstructor;
		}

		return (cachedConstructor_byType[type] = (
			data?: Record<string, unknown>,
		) => {
			if (data) {
				return { $type: type, ...data };
			}

			return Object.freeze({ $type: type });
		});
	},
});

const cachedConstructor_byType: Partial<Record<string, Function>> = {};
