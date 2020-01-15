import 'item-quantity-dropdown/lib/item-quantity-dropdown.min.css';
import 'item-quantity-dropdown/lib/item-quantity-dropdown.min';

$(document).ready(() => {
  $('.iqdropdown').iqDropdown(
    {
      // max total items
      maxItems: Infinity,
      // min total items
      minItems: 0,
      // text to show on the dropdown
      selectionText: 'item',
      // text to show for multiple items
      textPlural: 'items',
      // buttons to increment/decrement
      controls: {
        position: 'right',
        displayCls: 'iqdropdown-item-display',
        controlsCls: 'iqdropdown-item-controls',
        counterCls: 'counter',
      },
    },
  );
});
