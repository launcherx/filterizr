import { Position } from '../types/interfaces';
import Packer from './Packer';
import FilterContainer from '../FilterContainer';

/**
 * Packed layout for items that can have varying width as well as varying height.
 * @param filterContainer instance.
 */
export default (filterContainer: FilterContainer): Position[] => {
  const { filterItems } = filterContainer;
  const filteredItems = filterItems.getFiltered(
    filterContainer.options.get().filter.get()
  );

  //Instantiate new Packer, set up grid
  const packer = new Packer(filterContainer.dimensions.width);
  const filterItemsDimensions = filteredItems.map(
    ({ dimensions: { width, height } }): object => ({
      w: width,
      h: height,
    })
  );

  // Enhance array with coordinates
  // added in an extra object named fit
  // by the packing algorithm
  packer.fit(filterItemsDimensions);

  const targetPositions = filterItemsDimensions.map(
    ({ fit }: { fit: { x: number; y: number } }): Position => ({
      left: fit.x,
      top: fit.y,
    })
  );

  // set height of container
  filterContainer.updateHeight(packer.root.h);

  return targetPositions;
};