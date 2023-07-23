export default function getSearchParam(key) {
    return new URL(window.location.href).searchParams.get(key);
}
