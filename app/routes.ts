import { index, type RouteConfig, route } from "@react-router/dev/routes";

export default [
	index("routes/_index.tsx"),
	route("/robots.txt", "routes/resources/robots.ts"),
	route("/sitemap.xml", "routes/resources/sitemap.ts"),
] satisfies RouteConfig;
