export default function appendSearchParam(key, val) {
    let newUrl = new URL(window.location.href);
    let params = new URLSearchParams(newUrl.search);
    params.set(key, val);
    newUrl.search = params;
    window.history.replaceState({}, document.title, newUrl);
}
