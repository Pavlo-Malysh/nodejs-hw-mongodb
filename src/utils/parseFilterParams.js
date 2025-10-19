
const parseType = (type) => {
    const isString = typeof type === "string";
    if (!isString) return;
    const isType = (type) => ['work', 'home', 'personal'].includes(type);
    if (isType(type)) return type;
};

const parseBoolean = (value) => {
    const isString = typeof value === 'string';
    if (!isString) return;

    const isStringValue = value.trim().toLowerCase();

    if (isStringValue.includes("true")) return true;
    if (isStringValue.includes("false")) return false;

    if (typeof value === "boolean") return value;

};

export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;

    const parsedType = parseType(type);
    const parsedIsFavourite = parseBoolean(isFavourite);


    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};