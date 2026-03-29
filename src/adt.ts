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

////////////////////////////////////////////////////////////////////////////////

// @ts-ignore
export function ADT<T extends ADT>(): ADT.Mapper<T>;
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
	return ADT_Mapper();
}

export namespace ADT {
	export type Mapper<T extends ADT> = Identity<
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
}

////////////////////////////////////////////////////////////////////////////////

function ADT_Mapper<T extends ADT>(): ADT.Mapper<T> {
	const cache: Partial<Record<string, ReturnType<typeof ADT_Function>>> = {};
	return new Proxy({} as ADT.Mapper<T>, {
		get(_, type: string) {
			const fnCached = cache[type];
			if (fnCached) {
				return fnCached;
			}

			const fn = ADT_Function(type);
			cache[type] = fn;
			return fn;
		},
	});
}

function ADT_Function(
	type: string,
): { $type: string } & ((
	data?: Record<string, unknown>,
) => { $type: string } & (() => undefined)) {
	return Object.defineProperty(
		Object.assign(
			(data?: Record<string, unknown>) => {
				return Object.defineProperty(
					Object.assign(() => undefined, { $type: type, ...data }),
					"name",
					{
						value: `ADT.${type}`,
						writable: false,
						enumerable: false,
					},
				);
			},
			{ $type: type },
		),
		"name",
		{
			value: `ADT.${type}`,
			writable: false,
			enumerable: false,
		},
	);
}
