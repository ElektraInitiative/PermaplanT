import {calculateLineLength, correctForPreviousMapScaling} from "./BaseLayerConfigurator";
// import renderer from 'react-test-renderer';
// import { MemoryRouter } from 'react-router-dom';

// Render tests of Konva-Components are seemingly not possible using react-test-renderer.
// See: https://github.com/konvajs/react-konva/issues/419

/* it('renders correctly', () => {
  const tree = renderer
    .create(
      <MemoryRouter>
        <BaseLayerConfigurator onSubmit={() => {}} t={(key: string) => key}></BaseLayerConfigurator>
      </MemoryRouter> 
    )
    .toJSON();
  
  expect(tree).toMatchSnapshot();
});*/

it('calculates line lengths correctly', () => {
  // Line from x: 0, y: 0 to x: 1, y: 1
  // Length should be sqrt(1^2 + 1^2) = sqrt(2)
  expect(calculateLineLength([0, 0, 1, 1])).toBe(Math.sqrt(2)); 
}); 

it ('corrects for current map scaling', () => {
  expect(correctForPreviousMapScaling(1, 2)).toBe(5);  
}); 



