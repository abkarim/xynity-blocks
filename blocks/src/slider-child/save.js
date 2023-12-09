import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
export default function save() {
	return (
		<section {...useBlockProps.save()}>
			<InnerBlocks.Content />
		</section>
	);
}
