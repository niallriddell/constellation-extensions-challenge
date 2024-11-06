export default class BiMap<K, V> {
  private keyToValue = new Map<K, V>();
  private valueToKey = new Map<V, K>();

  set(key: K, value: V): void {
    if (this.keyToValue.has(key) || this.valueToKey.has(value)) {
      throw new Error('This key or value is already being used');
    }
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }

  getKey(value: V): K | undefined {
    return this.valueToKey.get(value);
  }

  getValue(key: K): V | undefined {
    return this.keyToValue.get(key);
  }

  deleteByKey(key: K): void {
    const value = this.keyToValue.get(key);
    if (value !== undefined) {
      this.valueToKey.delete(value);
    }
    this.keyToValue.delete(key);
  }

  deleteByValue(value: V): void {
    const key = this.valueToKey.get(value);
    if (key !== undefined) {
      this.keyToValue.delete(key);
    }
    this.valueToKey.delete(value);
  }

  hasKey(key: K): boolean {
    return this.keyToValue.has(key);
  }

  hasValue(value: V): boolean {
    return this.valueToKey.has(value);
  }

  getKeyToValueMap(): Map<K, V> {
    return this.keyToValue;
  }

  getValueToKeyMap(): Map<V, K> {
    return this.valueToKey;
  }
}
