describe('Basic user flow for Website', () => {
    // First, visit the lab 8 website
    beforeAll(async () => {
        //local port
        await page.goto('http://127.0.0.1:5500/');
    });
    
    it('Checking if add note works', async () => {
        const addButton = await page.$('.add-note');

        // Click the add button 5 times
        for (let i = 0; i < 5; i++) {
            await addButton.click();
            await page.mouse.click(0, 0);
        }

        // Check if 5 notes have been added
        const notes = await page.$$eval('.note', notes => notes.length);
        expect(notes).toBe(5);
    });

    it('Checking if editing new notes work', async () => {
        const notes = await page.$$('.note');

        // adding text to each note
        for (let i = 0; i < notes.length; i++) {
            await notes[i].type(`This is note: ${i + 1}`);
            await page.mouse.click(0, 0);
        }

        // Check if each note contains the correct text
        for (let i = 0; i < notes.length; i++) {
            const noteValue = await (await notes[i].getProperty('value')).jsonValue();
            expect(noteValue).toBe(`This is note: ${i + 1}`);
        }
    }, 10000);

    it('Checking if reload does not change notes', async () => {
        await page.reload();

        const notes = await page.$$('.note');

        // Check if each note contains the correct text
        for (let i = 0; i < notes.length; i++) {
            const noteValue = await (await notes[i].getProperty('value')).jsonValue();
            expect(noteValue).toBe(`This is note: ${i + 1}`);
        }
    }, 10000);

    it('Checking if editing existing notes work', async () => {
        const notes = await page.$$('.note');

        // adding text to each note
        for (let i = 0; i < notes.length; i++) {
            await notes[i].type(` Edit`);
            await page.mouse.click(0, 0);
        }

        // Check if each note contains the correct text
        for (let i = 0; i < notes.length; i++) {
            const noteValue = await (await notes[i].getProperty('value')).jsonValue();
            expect(noteValue).toBe(`This is note: ${i + 1} Edit`);
        }
    }, 10000);



    it('Checking if deleting notes work', async () => {
        const notes = await page.$$('.note');

        // Double clicking one note
        
        const note = notes[0]

        await page.evaluate((note) => {
            const dblclickEvent = new MouseEvent('dblclick', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            note.dispatchEvent(dblclickEvent);
            
        }, note);

        await page.mouse.click(0, 0);
        

        // Checking if one note is deleted
        const remainingNotesCount = await page.$$eval('.note', notes => notes.length);
        expect(remainingNotesCount).toBe(4);

    }, 10000);

})