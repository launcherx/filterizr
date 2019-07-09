import { FILTERIZR_STATE } from '../config';
import { FilterizrState } from '../types';
import { Resizable } from '../types/interfaces';
import { debounce } from '../utils';
import FilterizrOptions from '../FilterizrOptions';
import FilterItem from '../FilterItem';
import FilterItems from '../FilterItems';
import FilterizrElement from '../FilterizrElement';
import {
  makeInitialStyles,
  makePaddingStyles,
  makeHeightStyles,
} from './styles';

/**
 * Resembles the grid of items within Filterizr.
 */
export default class FilterContainer extends FilterizrElement
  implements Resizable {
  public filterItems: FilterItems;
  public dimensions: {
    width: number;
    height: number;
  };

  private _filterizrState: FilterizrState;

  public constructor(node: Element, options: FilterizrOptions) {
    if (!node) {
      throw new Error(
        'Filterizr: could not initialize container, check the selector or node you passed to the constructor exists.'
      );
    }
    super(node, options);
    this._filterizrState = FILTERIZR_STATE.IDLE;
    this.setStyles(makeInitialStyles(this.options));
    this.filterItems = this.makeFilterItems(this.options);
    this.dimensions = {
      width: this.node.clientWidth,
      height: 0,
    };
    this.filterItems.updateDimensions();
    this.bindEvents();
  }

  public set filterizrState(filterizrState: FilterizrState) {
    this._filterizrState = filterizrState;
  }

  public destroy(): void {
    super.destroy();
    this.unbindEvents();
    this.filterItems.destroy();
  }

  /**
   * Turn the HTML elements in the grid to FilterItem
   * instances and return a collection of them.
   * @throws when no filter items are found in the grid.
   */
  public makeFilterItems(options: FilterizrOptions): FilterItems {
    const filterItemNodes = Array.from(
      this.node.querySelectorAll(options.get().gridItemsSelector)
    );
    const filterItemsArray = filterItemNodes.map(
      (node, index): FilterItem => new FilterItem(node, index, options)
    );

    const filterItems = new FilterItems(filterItemsArray, options);
    if (!filterItems.length) {
      throw new Error(
        "Filterizr: cannot initialize empty container. Make sure the gridItemsSelector option corresponds to the selector of your grid's items"
      );
    }

    return filterItems;
  }

  public insertItem(node: HTMLElement): void {
    const nodeModified = node.cloneNode(true) as Element;
    nodeModified.removeAttribute('style');
    this.node.appendChild(nodeModified);
    const filterItem = new FilterItem(
      nodeModified,
      this.filterItems.length,
      this.options
    );
    filterItem.enableCssTransitions();
    this.filterItems.push(filterItem);
  }

  public removeItem(node: HTMLElement): void {
    this.filterItems.remove(node);
    this.node.removeChild(node);
  }

  public updateDimensions(): void {
    this.dimensions.width = this.node.clientWidth;
    this.filterItems.updateDimensions();
  }

  public updatePaddings(): void {
    this.setStyles(makePaddingStyles(this.options));
  }

  public setHeight(newHeight: number): void {
    this.dimensions.height = newHeight;
    this.setStyles(makeHeightStyles(newHeight));
  }

  public bindEvents(): void {
    const {
      animationDuration,
      callbacks,
      delay,
      delayMode,
      gridItemsSelector,
    } = this.options.get();
    const animationDelay =
      delayMode === 'progressive' ? delay * this.filterItems.length : delay;
    this.eventReceiver.on('transitionend', debounce(
      (event: any) => {
        const targetIsFilterItem = Array.from(event.target.classList).reduce(
          (acc: boolean, val: string): boolean =>
            acc || gridItemsSelector.includes(val),
          false
        );
        if (targetIsFilterItem) {
          switch (this._filterizrState) {
            case FILTERIZR_STATE.FILTERING:
              this.trigger('filteringEnd');
              break;
            case FILTERIZR_STATE.SORTING:
              this.trigger('sortingEnd');
              break;
            case FILTERIZR_STATE.SHUFFLING:
              this.trigger('shufflingEnd');
              break;
          }
          this.filterizrState = FILTERIZR_STATE.IDLE;
        }
      },
      animationDuration * 100 + animationDelay,
      false
    ) as EventListener);
    // Public Filterizr events
    this.eventReceiver.on('init', callbacks.onInit);
    this.eventReceiver.on('filteringStart', callbacks.onFilteringStart);
    this.eventReceiver.on('filteringEnd', callbacks.onFilteringEnd);
    this.eventReceiver.on('shufflingStart', callbacks.onShufflingStart);
    this.eventReceiver.on('shufflingEnd', callbacks.onShufflingEnd);
    this.eventReceiver.on('sortingStart', callbacks.onSortingStart);
    this.eventReceiver.on('sortingEnd', callbacks.onSortingEnd);
  }

  public unbindEvents(): void {
    this.eventReceiver.off('transitionend');
    this.eventReceiver.off('init');
    this.eventReceiver.off('filteringStart');
    this.eventReceiver.off('filteringEnd');
    this.eventReceiver.off('shufflingStart');
    this.eventReceiver.off('shufflingEnd');
    this.eventReceiver.off('sortingStart');
    this.eventReceiver.off('sortingEnd');
  }
}
