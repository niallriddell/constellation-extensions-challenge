export declare class BiMap<K, V> {
    private keyToValue;
    private valueToKey;
    set(key: K, value: V): void;
    getKey(value: V): K | undefined;
    getValue(key: K): V | undefined;
    deleteByKey(key: K): void;
    deleteByValue(value: V): void;
    hasKey(key: K): boolean;
    hasValue(value: V): boolean;
    getKeyToValueMap(): Map<K, V>;
    getValueToKeyMap(): Map<V, K>;
}
//# sourceMappingURL=bimap.d.ts.map