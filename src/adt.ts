import type { Identity } from "./adt/identity.js";
import type { Intersect } from "./adt/intersect.js";

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

export namespace ADT {
	export type Keys<T extends ADT> = T["$type"];

	export type Pick<T extends ADT, TType extends Keys<T>> = Extract<
		T,
		ADT<TType>
	>;

	export type Omit<T extends ADT, TType extends Keys<T>> = Exclude<
		T,
		ADT<TType>
	>;
}

// @ts-ignore
export function ADT<T extends ADT>(): ADTMapper<T>;
export function ADT<T>(value: T): value is Extract<T, ADT<string>>;
export function ADT<T>(...args: [] | [value: unknown]) {
	if (args.length === 1) {
		const value = args[0];
		return value &&
			(typeof value === "object" || typeof value === "function") &&
			"$type" in value
			? !!value.$type
			: false;
	}
	return ADTMapper();
}

function ADTMapper<T extends ADT>(): ADTMapper<T> {
	const cache: Partial<Record<string, ADTFunction>> = {};
	return new Proxy({} as ADTMapper<T>, {
		get(_, type: string) {
			const fnCached = cache[type];
			if (fnCached) {
				return fnCached;
			}

			const fn = ADTFunction(type);
			cache[type] = fn;
			return fn;
		},
	});
}

type ADTMapper<T extends ADT> = Identity<
	Intersect<
		T extends { $type: string }
			? [Exclude<keyof T, "$type">] extends [never]
				? {
						// Variant without data.
						[Key in T["$type"]]: T;
					}
				: {
						// Variant with data.
						[Key in T["$type"]]: (
							...args: Record<never, never> extends Omit<T, "$type">
								? // Variant without required data properties.
									[data?: Identity<Omit<T, "$type">>]
								: // Variant with required data properties.
									[data: Identity<Omit<T, "$type">>]
						) => T;
					}
			: never
	>
>;

type ADTFunction = (
	data?: Record<string, unknown>,
) => { $type: string } & Record<string, unknown>;

function ADTFunction(type: string): ADTFunction {
	return Object.assign(
		function ADTFunction(data?: Record<string, unknown>) {
			return { $type: type, ...data };
		},
		{ $type: type },
	);
}
