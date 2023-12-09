import { __ } from "@wordpress/i18n";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "./editor.scss";

/**
 * Allowed blocks in innerBlocks
 */
const ALLOWED_BLOCKS = ["core/image"];

export default function Edit() {
	return (
		<section {...useBlockProps()}>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				template={[["core/image", {}]]}
				templateLock="all"
			/>
		</section>
	);
}
