import { UnitecAppPage } from './app.po';

describe('unitec-app App', () => {
  let page: UnitecAppPage;

  beforeEach(() => {
    page = new UnitecAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
