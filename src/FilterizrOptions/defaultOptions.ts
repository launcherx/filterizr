import ActiveFilter from '../ActiveFilter';
import { noop } from '../utils';

export interface RawOptionsCallbacks {
  onInit?: Function;
  onFilteringStart?: EventListener;
  onFilteringEnd?: EventListener;
  onShufflingStart?: EventListener;
  onShufflingEnd?: EventListener;
  onSortingStart?: EventListener;
  onSortingEnd?: EventListener;
  onTransitionEnd?: EventListener;
}

export interface BaseOptions {
  animationDuration?: number;
  callbacks?: RawOptionsCallbacks;
  controlsSelector?: string;
  delay?: number;
  delayMode?: 'alternate' | 'progressive';
  easing?: string;
  filterOutCss?: object;
  filterInCss?: object;
  gridItemsSelector?: string;
  layout?:
    | 'horizontal'
    | 'vertical'
    | 'sameHeight'
    | 'sameWidth'
    | 'sameSize'
    | 'packed';
  multifilterLogicalOperator?: 'or' | 'and';
  searchTerm?: string;
  setupControls?: boolean;
}

export interface RawOptions extends BaseOptions {
  filter?: string | string[];
}

export interface Options extends BaseOptions {
  filter: ActiveFilter;
}

const defaultUserOptions: RawOptions = {
  animationDuration: 0.5,
  callbacks: {
    onInit: noop,
    onFilteringStart: noop,
    onFilteringEnd: noop,
    onShufflingStart: noop,
    onShufflingEnd: noop,
    onSortingStart: noop,
    onSortingEnd: noop,
  },
  controlsSelector: '',
  delay: 0,
  delayMode: 'progressive',
  easing: 'ease-out',
  filter: 'all',
  filterOutCss: {
    opacity: 0,
    transform: 'scale(0.5)',
  },
  filterInCss: {
    opacity: 1,
    transform: 'scale(1)',
  },
  gridItemsSelector: '.filtr-item',
  layout: 'sameSize',
  multifilterLogicalOperator: 'or',
  searchTerm: '',
  setupControls: true,
};

export default defaultUserOptions;