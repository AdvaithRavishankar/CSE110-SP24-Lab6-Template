describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('https://elaine-ch.github.io/Lab6_Part1_Starter/');
  });

  // Next, check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });
    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
        return prodItems.map(item => {
            // Grab all of the json data stored inside
            return item.data;
        });
    });

    console.log(`Checking all product item ${prodItemsData.length}`);
    // Make sure the title, price, and image are populated in the JSON for each product-item
    for(let i = 0; i < prodItemsData.length; i++) {
        console.log(`Checking product item ${i+1}/${prodItemsData.length}`);
        let item = prodItemsData[i];
        if (item.title.length == 0) { allArePopulated = false; }
        if (item.price.length == 0) { allArePopulated = false; }
        if (item.image.length == 0) { allArePopulated = false; }
        if (!allArePopulated) { break; }
    }
    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  }, 10000);

  it('Make sure <product-item> elements are populated', async () => {
    const allArePopulated = await page.$$eval('product-item', prodItems => {
      return prodItems.every(item => {
        const data = item.data;
        return data && data.title && data.title.length > 0 && 
               data.price && data.price > 0 && 
               data.image && data.image.length > 0;
      });
    });
    expect(allArePopulated).toBe(true);
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    // TODO - Step 2
    // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
    // Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
    // Once you have the button, you can click it and check the innerText property of the button.
    // Once you have the innerText property, use innerText.jsonValue() to get the text value of it

    // Query a <product-item> element
    const productItem = await page.$('product-item');

    // Grab the shadowRoot of that element
    const shadowRoot = await productItem.getProperty('shadowRoot');

    // Query a button from that shadowRoot
    const button = await shadowRoot.$('button');

    // Click the button
    await button.click();

    // Check the innerText property of the button after click
    const buttonText = await button.evaluate(node => node.innerText);

    // Expect the button text to be "Remove from Cart"
    expect(buttonText).toContain('Remove from Cart');

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 3
    // Query select all of the <product-item> elements, then for every single product element
    // get the shadowRoot and query select the button inside, and click on it.
    // Check to see if the innerText of #cart-count is 20

    // Query select all of the <product-item> elements
    const productItems = await page.$$('product-item');

    // Click the "Add to Cart" button for each product-item
    for(let i = 0; i < productItems.length; i++){
      const productItem = productItems[i];
      const shadowRoot = await page.evaluateHandle(el => el.shadowRoot, productItem);
      const button = await shadowRoot.$('button');
      const btntxt = await page.evaluateHandle(el => el.innerText, button);
      const buttonText = await btntxt.jsonValue();
      if (buttonText === "Add to Cart") {
        await button.click();
      }
    }

    // Check to see if the innerText of #cart-count is 20
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');

  }, 20000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 4
    // Reload the page, then select all of the <product-item> elements, and check every
    // element to make sure that all of their buttons say "Remove from Cart".
    // Also check to make sure that #cart-count is still 20
    
    // reloading page
    await page.reload();

    // Query select all of the <product-item> elements
    const productItems = await page.$$('product-item');

    for(let i = 0; i < productItems.length; i++){
      const productItem = productItems[i];
      const shadowRoot = await page.evaluateHandle(el => el.shadowRoot, productItem);
      const button = await shadowRoot.$('button');
      const btntxt = await page.evaluateHandle(el => el.innerText, button);
      const buttonText = await btntxt.jsonValue();
      expect(buttonText).toBe("Remove from Cart");
    }

    // Check to see if the innerText of #cart-count is 20
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('20');

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
    // TODO - Step 5
    // At this point he item 'cart' in localStorage should be 
    // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is

    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    const expected = '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]';
    expect(cart).toBe(expected);

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');
    // TODO - Step 6
    // Go through and click "Remove from Cart" on every single <product-item>, just like above.
    // Once you have, check to make sure that #cart-count is now 0
    // Query select all of the <product-item> elements
    const productItems = await page.$$('product-item');

    // Click the "Add to Cart" button for each product-item
    for(let i = 0; i < productItems.length; i++){
      const productItem = productItems[i];
      const shadowRoot = await page.evaluateHandle(el => el.shadowRoot, productItem);
      const button = await shadowRoot.$('button');
      const btntxt = await page.evaluateHandle(el => el.innerText, button);
      const buttonText = await btntxt.jsonValue();
      if (buttonText === "Remove from Cart") {
        await button.click();
      }
    }

    // Check to see if the innerText of #cart-count is 0
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');

  }, 20000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    // TODO - Step 7
    // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
    // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
    // Also check to make sure that #cart-count is still 0

    // reloading page
    await page.reload();

    // Query select all of the <product-item> elements
    const productItems = await page.$$('product-item');

    for(let i = 0; i < productItems.length; i++){
      const productItem = productItems[i];
      const shadowRoot = await page.evaluateHandle(el => el.shadowRoot, productItem);
      const button = await shadowRoot.$('button');
      const btntxt = await page.evaluateHandle(el => el.innerText, button);
      const buttonText = await btntxt.jsonValue();
      expect(buttonText).toBe("Add to Cart");
    }

    // Check to see if the innerText of #cart-count is 0
    const cartCount = await page.$eval('#cart-count', el => el.innerText);
    expect(cartCount).toBe('0');


  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');
    // TODO - Step 8
    // At this point he item 'cart' in localStorage should be '[]', check to make sure it is
    const cart = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    const expected = '[]';
    expect(cart).toBe(expected);


  });
});
