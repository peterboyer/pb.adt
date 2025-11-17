import type { Identity } from "./shared/identity.js";
import type { Intersect } from "./shared/intersect.js";

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

export const ADT = <T extends ADT>(): ADTMapper<T> => proxy as any;

const proxy = new Proxy({}, { get: (_, type: string) => mapper.bind(type) });
const mapper = function (this: string, data: any) {
	return { $type: this, ...data };
};

type ADTMapper<T extends ADT> = Identity<
	Intersect<
		T extends { $type: string }
			? [Exclude<keyof T, "$type">] extends [never]
				? { [Key in T["$type"]]: () => T }
				: {
						[Key in T["$type"]]: (
							...args: Record<never, never> extends Omit<T, "$type">
								? [data?: Identity<Omit<T, "$type">>]
								: [data: Identity<Omit<T, "$type">>]
						) => T;
					}
			: never
	>
>;
