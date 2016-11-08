import { Nichidai2016Page } from './app.po';

describe('nichidai2016 App', function() {
  let page: Nichidai2016Page;

  beforeEach(() => {
    page = new Nichidai2016Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
