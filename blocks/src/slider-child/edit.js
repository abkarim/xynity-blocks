import { __ } from "@wordpress/i18n";
import {
	BlockControls,
	InnerBlocks,
	useBlockProps,
} from "@wordpress/block-editor";
import { Toolbar, ToolbarButton, Icon } from "@wordpress/components";
import { trash } from "@wordpress/icons";

import "./editor.scss";
import { useDispatch } from "@wordpress/data";

/**
 * Allowed blocks in innerBlocks
 */
const ALLOWED_BLOCKS = ["core/image"];

export default function Edit({ clientId }) {
	const { removeBlock } = useDispatch("core/block-editor");

	/**
	 * Removes current slide
	 */
	function removeSlide() {
		/**
		 * ? History doesn't work properly when removed with it
		 */
		removeBlock(clientId);
	}

	return (
		<section {...useBlockProps()}>
			<BlockControls>
				<Toolbar label="Slider Controls">
					<ToolbarButton
						showTooltip={true}
						label="Delete current slide"
						onClick={removeSlide}>
						<Icon icon={trash} />
					</ToolbarButton>
				</Toolbar>
			</BlockControls>
			<InnerBlocks
				allowedBlocks={ALLOWED_BLOCKS}
				template={[["core/image", {}]]}
				templateLock="all"
			/>
		</section>
	);
}
