/// <reference path="../typings/ChangeLinr.d.ts" />
/// <reference path="../typings/StringFilr.d.ts" />
declare namespace PixelRendr {
    /**
     * A single [red, green, blue, alpha] pixel's colors.
     */
    type IPixel = [number, number, number, number];
    /**
     * A palette of potential pixel colors.
     */
    type IPalette = IPixel[];
    /**
     * A base container for storing raw sprites and their renders.
     */
    interface ILibrary {
        /**
         * The original sources for the sprites.
         */
        raws: any;
        /**
         * Rendered sprites from the raw sources.
         */
        sprites?: IRenderLibrary;
    }
    /**
     * Rendered sprite data generated from a source sprite.
     */
    interface IRender {
        /**
         * The original raw command that generated this render.
         */
        source: ICommand;
        /**
         * Output sprites generated by the source.
         */
        sprites: IRenderSprites;
        /**
         * An optional filter to change colors by, if source is a "filter" command.
         */
        filter: IFilterAttributes;
        /**
         * Any containers storing this IRender.
         */
        containers: IRenderContainerListing[];
    }
    /**
     * Generated sprites stored within an IRender.
     */
    interface IRenderSprites {
        [i: string]: Uint8ClampedArray | ISpriteMultiple;
    }
    /**
     * References to contains that store an IRender.
     */
    interface IRenderContainerListing {
        /**
         * A container storing the listing's IRender.
         */
        container: IRenderLibrary;
        /**
         * The key under which the IRender is stored.
         */
        key: string;
    }
    /**
     * A searchable storage tree of IRenders.
     */
    interface IRenderLibrary {
        [i: string]: IRenderLibrary | IRender;
    }
    /**
     * Information for expanding a sprite. A PixelDrawr's IThing will often be passed
     * to satisfy this at runtime.
     */
    interface ISpriteAttributes {
        filter?: IFilter;
        [i: string]: number | IFilter;
    }
    /**
     * A raw sprite, as either the pixel String or Array of commands.
     */
    type ICommand = string | any[];
    /**
     * A "filter" command, as ["filter", [source path], "<filter name>"].
     */
    type IFilterCommand = [string, string[], string];
    /**
     * A "multiple" command, as ["multiple", "<direction>", <sprites>].
     */
    type IMultipleCommand = [string, string, ISpriteMultipleSettings];
    /**
     * A "same" command, as ["same", [source path]].
     */
    type ISameCommand = [string, string[]];
    interface IFilter {
        0: string;
        1: {
            [i: string]: string;
        };
    }
    interface IFilterContainer {
        [i: string]: IFilter;
    }
    interface IFilterAttributes {
        filter: IFilter;
    }
    /**
     * Raw settings to generate an ISpriteMultiple.
     */
    interface ISpriteMultipleSettings {
        /**
         * Raw sprite component for the top section.
         */
        top?: string;
        /**
         * How many pixels tall the top section is, if it exists.
         */
        topheight?: number;
        /**
         * Raw sprite component for the right section.
         */
        right?: string;
        /**
         * How many pixels wide the right section is, if it exists.
         */
        rightwidth?: number;
        /**
         * Raw sprite component for the bottom section.
         */
        bottom?: string;
        /**
         * How many pixels tall the bottom section is, if it exists.
         */
        bottomheight?: number;
        /**
         * Raw sprite component for the left section.
         */
        left?: string;
        /**
         * How many pixels wide the left section is, if it exists.
         */
        leftwidth?: number;
        /**
         * Raw sprite component for the center section.
         */
        middle?: string;
        /**
         * Whether the center section should stretch to fill its space.
         */
        middleStretch?: boolean;
    }
    /**
     * Container for multiple sprite sections of Uint8ClampedArray of data.
     */
    interface ISpriteMultiple {
        /**
         * Storage for each internal Uint8ClampedArray sprite, keyed by container.
         */
        sprites: IClampedArraysContainer;
        /**
         * The direction of sprite, such as "horizontal".
         */
        direction: string;
        /**
         * How many pixels tall the top section is, if it exists.
         */
        topheight: number;
        /**
         * How many pixels wide the right section is, if it exists.
         */
        rightwidth: number;
        /**
         * How many pixels tall the bottom section is, if it exists.
         */
        bottomheight: number;
        /**
         * How many pixels wide the left section is, if it exists.
         */
        leftwidth: number;
        /**
         * Whether the middle section should be stretched to fill the remaining
         * space instead of filling as a pattern.
         */
        middleStretch: boolean;
    }
    /**
     * Storage for an ISpriteMultiple's generated sprites.
     */
    interface IClampedArraysContainer {
        [i: string]: Uint8ClampedArray;
    }
    interface IGeneralSpriteGenerator {
        (render: IRender, key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
    }
    interface IPixelRendrEncodeCallback {
        (result: string, image: HTMLImageElement, ...args: any[]): any;
    }
    /**
     * Settings to initialize a new IPixelRendr.
     */
    interface IPixelRendrSettings {
        /**
         * The default palette of colors to use for sprites.
         */
        paletteDefault: IPalette;
        /**
         * A nested library of sprites to process.
         */
        library?: any;
        /**
         * Filters that may be used by sprites in the library.
         */
        filters?: IFilterContainer;
        /**
         * An amount to expand sprites by when processing (by default, 1 for not at
         * all).
         */
        scale?: number;
        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * vertically (by default, "flip-vert").
         */
        flipVert?: string;
        /**
         * What sub-class in decode keys should indicate a sprite is to be flipped
         * horizontally (by default, "flip-vert").
         */
        flipHoriz?: string;
        /**
         * What key in attributions should contain sprite widths (by default,
         * "spriteWidth").
         */
        spriteWidth?: string;
        /**
         *  What key in attributions should contain sprite heights (by default,
         * "spriteHeight").
         */
        spriteHeight?: string;
        /**
         * A replacement for window.Uint8ClampedArray, if desired.
         */
        Uint8ClampedArray?: typeof Uint8ClampedArray;
    }
    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    interface IPixelRendr {
        /**
         * @returns The default colors used for palettes in sprites.
         */
        getPaletteDefault(): IPalette;
        /**
         * @returns The base container for storing sprite information.
         */
        getBaseLibrary(): any;
        /**
         * @returns The amount to expand sprites by when processing.
         */
        getScale(): number;
        /**
         * @returns The StringFilr interface on top of the base library.
         */
        getBaseFiler(): StringFilr.IStringFilr<any>;
        /**
         * @returns The processor that turns raw strings into partial sprites.
         */
        getProcessorBase(): ChangeLinr.IChangeLinr;
        /**
         * @returns The processor that converts partial sprites and repeats rows.
         */
        getProcessorDims(): ChangeLinr.IChangeLinr;
        /**
         * @returns The processor that takes real images and compresses their data
         *          into sprite Strings.
         */
        getProcessorEncode(): ChangeLinr.IChangeLinr;
        /**
         * Resets the nested library of sprite sources.
         *
         * @param library   A new nested library of sprites.
         */
        resetLibrary(library: any): void;
        /**
         * Resets an individual rendered sprite.
         *
         * @param key   The key of the sprite to render.
         */
        resetRender(key: string): void;
        /**
         * Retrieves the base sprite under the given key.
         *
         * @param key   A key for a base sprite.
         * @returns The base sprite for the key. This will be a Uint8ClampedArray
         *          or SpriteMultiple if a sprite is found, or the deepest matching
         *          Object in the library if not.
         */
        getSpriteBase(key: string): Uint8ClampedArray | ISpriteMultiple;
        /**
         * Replaces the current palette with a new one.
         *
         * @param palette   The new palette to replace the current one.
         */
        changePalette(palette: IPalette): void;
        /**
         * Standard render function. Given a key, this finds the raw information via
         * BaseFiler and processes it using ProcessorDims. Attributes are needed so
         * the ProcessorDims can stretch it on width and height.
         *
         * @param key   The general key for the sprite.
         * @param attributes   Additional attributes for the sprite; width and height
         *                     Numbers are required.
         * @returns A sprite for the given key and attributes.
         */
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        /**
         * Encodes an image into a sprite via ProcessorEncode.process.
         *
         * @param image   An image to encode.
         * @param callback   An optional callback to call with image and the result.
         * @param args   Any additional arguments to pass to the callback.
         * @returns The resultant sprite.
         */
        encode(image: HTMLImageElement, callback?: IPixelRendrEncodeCallback, ...args: any[]): string;
        /**
         * Fetches an image from a source and encodes it into a sprite via
         * ProcessEncode.process. An HtmlImageElement is created and given an onload
         * of this.encode.
         *
         * @param uri   The URI of an image to encode.
         * @param callback   A callback to call on the results.
         */
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        /**
         * Miscellaneous utility to generate a complete palette from raw image pixel
         * data. Unique [r,g,b,a] values are found using tree-based caching, and
         * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
         * pixel has a=0, it's completely transparent and goes before anything else
         * in the palette. Grayscale colors come next in order of light to dark, and
         * general colors come next sorted by decreasing r, g, and b in order.
         *
         * @param data   The equivalent data from a context's getImageData(...).data.
         * @param forceZeroColor   Whether the palette should have a [0,0,0,0] color
         *                         as the first element even if data does not contain
         *                         it (by default, false).
         * @param giveArrays   Whether the resulting palettes should be converted to
         *                     Arrays (by default, false).
         * @returns A working palette that may be used in sprite settings (Array[] if
         *          giveArrays is true).
         */
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        /**
         * Copies a stretch of members from one Uint8ClampedArray or number[] to
         * another. This is a useful utility Function for code that may use this
         * PixelRendr to draw its output sprites, such as PixelDrawr.
         *
         * @param source   An Array-like source to copy from.
         * @param destination   An Array-like destination to copy to.
         * @param readloc   Where to start reading from in the source.
         * @param writeloc   Where to start writing to in the source.
         * @param writelength   How many members to copy over.
         * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
         * @see http://www.javascripture.com/Uint8ClampedArray
         */
        memcpyU8(source: Uint8ClampedArray | number[], destination: Uint8ClampedArray | number[], readloc?: number, writeloc?: number, writelength?: number): void;
    }
    /**
     * Compresses images into text blobs in real time with fast cached lookups.
     */
    class PixelRendr implements IPixelRendr {
        /**
         * The base container for storing sprite information.
         */
        private library;
        /**
         * A StringFilr interface on top of the base library.
         */
        private BaseFiler;
        /**
         * Applies processing Functions to turn raw Strings into partial sprites,
         * used during reset calls.
         */
        private ProcessorBase;
        /**
         * Takes partial sprites and repeats rows, then checks for dimension
         * flipping, used during on-demand retrievals.
         */
        private ProcessorDims;
        /**
         * Reverse of ProcessorBase: takes real images and compresses their data
         * into sprites.
         */
        private ProcessorEncode;
        /**
         * The default colors used for palettes in sprites.
         */
        private paletteDefault;
        /**
         * The default digit size (how many characters per number).
         */
        private digitsizeDefault;
        /**
         * Utility RegExp to split Strings on every #digitsize characters.
         */
        private digitsplit;
        /**
         * How much to "scale" each sprite by (repeat the pixels this much).
         */
        private scale;
        /**
         * String key to know whether to flip a processed sprite vertically,
         * based on supplied attributes.
         */
        private flipVert;
        /**
         * String key to know whether to flip a processed sprite horizontally,
         * based on supplied attributes.
         */
        private flipHoriz;
        /**
         * String key to obtain sprite width from supplied attributes.
         */
        private spriteWidth;
        /**
         * String key to obtain sprite height from supplied attributes.
         */
        private spriteHeight;
        /**
         * Filters for processing sprites.
         */
        private filters;
        /**
         * Generators used to generate Renders from sprite commands.
         */
        private commandGenerators;
        /**
         * A reference for window.Uint8ClampedArray, or replacements such as
         * Uint8Array if needed.
         */
        private Uint8ClampedArray;
        /**
         * Initializes a new instance of the PixelRendr class.
         *
         * @param settings   Settings to be used for initialization.
         */
        constructor(settings: IPixelRendrSettings);
        /**
         * @returns The default colors used for palettes in sprites.
         */
        getPaletteDefault(): IPalette;
        /**
         * @returns The amount to expand sprites by when processing.
         */
        getScale(): number;
        /**
         * @returns The base container for storing sprite information.
         */
        getBaseLibrary(): any;
        /**
         * @returns The StringFilr interface on top of the base library.
         */
        getBaseFiler(): StringFilr.IStringFilr<string[] | any>;
        /**
         * @returns The processor that turns raw strings into partial sprites.
         */
        getProcessorBase(): ChangeLinr.IChangeLinr;
        /**
         * @returns The processor that converts partial sprites and repeats rows.
         */
        getProcessorDims(): ChangeLinr.IChangeLinr;
        /**
         * @returns The processor that takes real images and compresses their data
         *          into sprite Strings.
         */
        getProcessorEncode(): ChangeLinr.IChangeLinr;
        /**
         * Retrieves the base sprite under the given key.
         *
         * @param key   A key for a base sprite.
         * @returns The base sprite for the key. This will be a Uint8ClampedArray
         *          or SpriteMultiple if a sprite is found, or the deepest matching
         *          Object in the library if not.
         */
        getSpriteBase(key: string): Uint8ClampedArray | ISpriteMultiple;
        /**
         * Resets the nested library of sprite sources.
         *
         * @param library   A new nested library of sprites.
         */
        resetLibrary(library: any): void;
        /**
         * Resets an individual rendered sprite.
         *
         * @param key   The key of the sprite to render.
         */
        resetRender(key: string): void;
        /**
         * Replaces the current palette with a new one.
         *
         * @param palette   The new palette to replace the current one.
         */
        changePalette(palette: IPalette): void;
        /**
         * Standard render function. Given a key, this finds the raw information via
         * BaseFiler and processes it using ProcessorDims. Attributes are needed so
         * the ProcessorDims can stretch it on width and height.
         *
         * @param key   The general key for the sprite.
         * @param attributes   Additional attributes for the sprite; width and height
         *                     Numbers are required.
         * @returns A sprite for the given key and attributes.
         */
        decode(key: string, attributes: any): Uint8ClampedArray | ISpriteMultiple;
        /**
         * Encodes an image into a sprite via ProcessorEncode.process.
         *
         * @param image   An image to encode.
         * @param callback   An optional callback to call with image and the result.
         * @param args   Any additional arguments to pass to the callback.
         * @returns The resultant sprite.
         */
        encode(image: HTMLImageElement, callback?: IPixelRendrEncodeCallback, ...args: any[]): string;
        /**
         * Fetches an image from a source and encodes it into a sprite via
         * ProcessEncode.process. An HtmlImageElement is created and given an onload
         * of this.encode.
         *
         * @param uri   The URI of an image to encode.
         * @param callback   A callback to call on the results.
         */
        encodeUri(uri: string, callback: IPixelRendrEncodeCallback): void;
        /**
         * Miscellaneous utility to generate a complete palette from raw image pixel
         * data. Unique [r,g,b,a] values are found using tree-based caching, and
         * separated into grayscale (r,g,b equal) and general (r,g,b unequal). If a
         * pixel has a=0, it's completely transparent and goes before anything else
         * in the palette. Grayscale colors come next in order of light to dark, and
         * general colors come next sorted by decreasing r, g, and b in order.
         *
         * @param data   The equivalent data from a context's getImageData(...).data.
         * @param forceZeroColor   Whether the palette should have a [0,0,0,0] color
         *                         as the first element even if data does not contain
         *                         it (by default, false).
         * @param giveArrays   Whether the resulting palettes should be converted to
         *                     Arrays (by default, false).
         * @returns A working palette that may be used in sprite settings (Array[] if
         *          giveArrays is true).
         */
        generatePaletteFromRawData(data: Uint8ClampedArray, forceZeroColor?: boolean, giveArrays?: boolean): Uint8ClampedArray[];
        /**
         * Copies a stretch of members from one Uint8ClampedArray or number[] to
         * another. This is a useful utility Function for code that may use this
         * PixelRendr to draw its output sprites, such as PixelDrawr.
         *
         * @param source   An Array-like source to copy from.
         * @param destination   An Array-like destination to copy to.
         * @param readloc   Where to start reading from in the source.
         * @param writeloc   Where to start writing to in the source.
         * @param writelength   How many members to copy over.
         * @see http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/
         * @see http://www.javascripture.com/Uint8ClampedArray
         */
        memcpyU8(source: Uint8ClampedArray | number[], destination: Uint8ClampedArray | number[], readloc?: number, writeloc?: number, writelength?: number): void;
        /**
         * Recursively travels through a library, turning all raw sprites and
         * commands into Renders.
         *
         * @param reference   The raw source structure to be parsed.
         * @param path   The path to the current place within the library.
         * @returns The parsed library Object.
         */
        private libraryParse(reference);
        /**
         * Generates a sprite for a Render based on its internal source and an
         * externally given String key and attributes Object. The sprite is stored
         * in the Render's sprites container under that key.
         *
         * @param render   A render whose sprite is being generated.
         * @param key   The key under which the sprite is stored.
         * @param attributes   Any additional information to pass to the sprite
         *                     generation process.
         */
        private generateRenderSprite(render, key, attributes);
        /**
         * Generates the pixel data for a single sprite.
         *
         * @param render   A render whose sprite is being generated.
         * @param key   The key under which the sprite is stored.
         * @param attributes   Any additional information to pass to the sprite generation
         *                     process.
         * @returns   The output sprite.
         */
        private generateSpriteSingleFromRender(render, key, attributes);
        /**
         * Generates the pixel data for a SpriteMultiple to be generated by creating
         * a container in a new SpriteMultiple and filing it with processed single
         * sprites.
         *
         * @param render   A render whose sprite is being generated.
         * @param key   The key under which the sprite is stored.
         * @param attributes   Any additional information to pass to the sprite generation
         *                     process.
         * @returns The output sprite.
         */
        private generateSpriteCommandMultipleFromRender(render, key, attributes);
        /**
         * Generates the output of a "same" command. The referenced Render or
         * directory are found, assigned to the old Render's directory, and
         * this.decode is used to find the output.
         *
         * @param render   A render whose sprite is being generated.
         * @param key   The key under which the sprite is stored.
         * @param attributes   Any additional information to pass to the
         *                              sprite generation process.
         * @returns The output sprite.
         */
        private generateSpriteCommandSameFromRender(render, key, attributes);
        /**
         * Generates the output of a "filter" command. The referenced Render or
         * directory are found, converted into a filtered Render or directory, and
         * this.decode is used to find the output.
         *
         * @param render   A render whose sprite is being generated.
         * @param key   The key under which the sprite is stored.
         * @param attributes   Any additional information to pass to the sprite generation
         *                     process.
         * @returns The output sprite.
         */
        private generateSpriteCommandFilterFromRender(render, key, attributes);
        /**
         * Recursively generates a directory of Renders from a filter. This is
         * similar to this.libraryParse, though the filter is added and references
         * aren't.
         *
         * @param directory   The current directory of Renders to create filtered versions
         *                    of.
         * @param filter   The filter being applied.
         * @returns An output directory containing Renders with the filter.
         */
        private generateRendersFromFilter(directory, filter);
        /**
         * Switches all of a given Render's containers to point to a replacement instead.
         *
         * @param render   A Render being replaced.
         * @param replacement   A replacement for render.
         */
        private replaceRenderInContainers(render, replacement);
        /**
         * Given a compressed raw sprite data string, this 'unravels' it. This is
         * the first Function called in the base processor. It could output the
         * Uint8ClampedArray immediately if given the area - deliberately does not
         * to simplify sprite library storage.
         *
         * @param colors   The raw sprite String, including commands like "p" and "x".
         * @returns A version of the sprite with fancy commands replaced by numbers.
         */
        private spriteUnravel(colors);
        /**
         * Repeats each number in the given string a number of times equal to the
         * scale. This is the second Function called by the base processor.
         *
         * @param colors   A series of sprite colors.
         * @returns   The same series, with each character repeated.
         */
        private spriteExpand(colors);
        /**
         * Used during post-processing before spriteGetArray to filter colors. This
         * is the third Function used by the base processor, but it just returns the
         * original sprite if no filter should be applied from attributes.
         * Filters are applied here because the sprite is just the numbers repeated,
         * so it's easy to loop through and replace them.
         *
         * @param colors   A series of color characters.
         * @param key   The unique key identifying this chain of transforms.
         * @param attributes   Attributes describing the filter to use.
         * @returns The original series of color characters, filtered.
         */
        private spriteApplyFilter(colors, key, attributes);
        /**
         * Converts an unraveled String of sprite numbers to the equivalent RGBA
         * Uint8ClampedArray. Each colors number will be represented by four numbers
         * in the output. This is the fourth Function called in the base processor.
         *
         * @param colors   A series of color characters.
         * @returns A series of pixels equivalent to the colors.
         */
        private spriteGetArray(colors);
        /**
         * Repeats each row of a sprite based on the container attributes to create
         * the actual sprite (before now, the sprite was 1 / scale as high as it
         * should have been). This is the first Function called in the dimensions
         * processor.
         *
         * @param sprite   A series of sprite pixels.
         * @param key   The unique key identifying this chain of transforms.
         * @param attributes   The container Object (commonly a Thing in GameStarter),
         *                     which must contain width and height numbers.
         * @returns A version of the original sprite, with rows repeated.
         */
        private spriteRepeatRows(sprite, key, attributes);
        /**
         * Optionally flips a sprite based on the flipVert and flipHoriz keys. This
         * is the second Function in the dimensions processor and the last step
         * before a sprite is deemed usable.
         *
         * @param sprite   A series of sprite pixels.
         * @param key   The unique key identifying this chain of transforms.
         * @param attributes   The container Object (commonly a Thing in GameStarter),
         *                     which must contain width and height numbers.
         * @returns A version of the original sprite, with dimensions flipped.
         */
        private spriteFlipDimensions(sprite, key, attributes);
        /**
         * Flips a sprite horizontally by reversing the pixels within each row. Rows
         * are computing using the spriteWidth in attributes.
         *
         * @param sprite   A series of sprite pixels.
         * @param attributes   The container Object (commonly a Thing in GameStarter),
         *                     which must contain width and height numbers.
         * @returns A version of the original sprite, flipped horizontally.
         */
        private flipSpriteArrayHoriz(sprite, attributes);
        /**
         * Flips a sprite vertically by reversing the order of the rows. Rows are
         * computing using the spriteWidth in attributes.
         *
         * @param sprite   A series of sprite pixels.
         * @param attributes   The container Object (commonly a Thing in GameStarter),
         *                     which must contain width and height numbers.
         * @returns A version of the original sprite, flipped vertically.
         */
        private flipSpriteArrayVert(sprite, attributes);
        /**
         * Flips a sprite horizontally and vertically by reversing the order of the
         * pixels. This doesn't actually need attributes.
         *
         * @param sprite   A series of sprite pixels.
         * @param attributes   The container Object (commonly a Thing in GameStarter),
         *                     which must contain width and height numbers.
         * @returns A version of the original sprite, flipped horizontally and vertically.
         */
        private flipSpriteArrayBoth(sprite);
        /**
         * Retrives the raw pixel data from an image element. It is copied onto a
         * canvas, which as its context return the .getImageDate().data results.
         * This is the first Fiunction used in the encoding processor.
         *
         * @param image   An image whose data is to be retrieved.
         */
        private imageGetData(image);
        /**
         * Determines which pixels occur in the data and at what frequency. This is
         * the second Function used in the encoding processor.
         *
         * @param data   The raw pixel data obtained from the imageData of a canvas.
         * @returns [pixels, occurences], where pixels is an array of [rgba] values
         *          and occurences is an Object mapping occurence frequencies of
         *          palette colors in pisels.
         */
        private imageGetPixels(data);
        /**
         * Concretely defines the palette to be used for a new sprite. This is the
         * third Function used in the encoding processor, and creates a technically
         * usable (but uncompressed) sprite with information to compress it.
         *
         * @param information   [pixels, occurences], a result directly from imageGetPixels.
         * @returns [palette, numbers, digitsize], where palette is a String[] of palette
         *          numbers, numbers is the actual sprite data, and digitsize is the sprite's
         *          digit size.
         */
        private imageMapPalette(information);
        /**
         * Compresses a nearly complete sprite from imageMapPalette into a
         * compressed, storage-ready String. This is the last Function in the
         * encoding processor.
         *
         * @param information   [palette, numbers, digitsize], a result directly from
         *                      imageMapPalette.
         * @returns The pixels from information, combined.
         */
        private imageCombinePixels(information);
        /**
         * Sets the palette and digitsize Default/digitsplit based off that palette.
         *
         * @param palette   The palette being assigned to paletteDefault.
         */
        private setPalette(palette);
        /**
         * Determines how many digits will be required to represent a member of
         * the palette.
         *
         * @param palette   A palette of colors.
         * @returns The equivalent digitsize for the palette.
         */
        private getDigitSizeFromArray(palette);
        /**
         * Determines how many digits will be required to represent a member of
         * the palette.
         *
         * @param palette   A palette of colors.
         * @returns The equivalent digitsize for the palette.
         */
        private getDigitSizeFromObject(palette);
        /**
         * Generates an actual palette Object for a given palette, using a digitsize
         * calculated from the palette.
         *
         * @param palette   A palette of colors
         * @returns The actual palette Object for the given palette, with an index
         *          for every palette member.
         */
        private getPaletteReference(palette);
        /**
         * Generates an actual palette Object for a given palette, using the default
         * digitsize.
         *
         * @param palette   A palette of colors.
         * @returns The actual palette Object for the given palette, with an index
         *          for every palette member.
         */
        private getPaletteReferenceStarting(palette);
        /**
         * Finds which rgba value in a palette is closest to a given value. This is
         * useful for determining which color in a pre-existing palette matches up
         * with a raw image's pixel. This is determined by which palette color has
         * the lowest total difference in integer values between r, g, b, and a.
         *
         * @param palette   The palette of pre-existing colors.
         * @param rgba   The RGBA values being assigned, as Numbers in [0, 255].
         * @returns The closest matching color index.
         */
        private getClosestInPalette(palette, rgba);
        /**
         * Creates a new String equivalent to an old String repeated any number of
         * times. If times is 0, a blank String is returned.
         *
         * @param string   The characters to repeat.
         * @param times   How many times to repeat (by default, 1).
         * @returns The original string, repeated.
         */
        private stringOf(text, times?);
        /**
         * Turns a Number into a String with a prefix added to pad it to a certain
         * number of digits.
         *
         * @param number   The original Number being padded.
         * @param size   How many digits the output must contain.
         * @param prefix   A prefix to repeat for padding (by default, "0").
         * @returns A Stringified digit of the given length.
         * @example makeDigit(7, 3); // '007'
         * @example makeDigit(7, 3, 1); // '117'
         */
        private makeDigit(num, size, prefix?);
        /**
         * Curry wrapper around makeDigit that reverses size and number argument
         * order. Useful for binding makeDigit.
         *
         * @param number   The original Number being padded.
         * @param size   How many digits the output must contain.
         * @returns A stringified digit of the given length.
         */
        private makeSizedDigit(size, digit);
        /**
         * Replaces all instances of an element in an Array.
         *
         * @param array   The original elements.
         * @param removed   The element to remove.
         * @param inserted   The element to insert.
         * @returns The original Array, with the element replaced.
         */
        private arrayReplace(array, removed, inserted);
        /**
         * Computes the sum of the differences of elements between two Arrays of
         * equal length.
         *
         * @param a   An Array of Numbers.
         * @param b   An Array of Numbers.
         * @returns The sum of differences between a and b.
         */
        private arrayDifference(a, b);
        /**
         * Converts an Array to an Object mapping values to indices.
         *
         * @param array   An Array to convert.
         * @returns An Object with an index equal to each element of the Array.
         */
        private getValueIndices(array);
        /**
         * Follows a path inside an Object recursively, based on a given path.
         *
         * @param object   An Object to delve within.
         * @param path   The ordered names of attributes to descend into.
         * @param index   The starting index in path.
         * @returns A found element within object.
         */
        private followPath(object, path, index);
    }
    /**
     * Summary container for a single PixelRendr sprite source. The original source
     * is stored, along with any generated outputs, information on its container,
     * and any filter.
     */
    class Render implements IRender {
        /**
         * The original command to create this Render, which is either a plain
         * String source or an Array representing a command.
         */
        source: string | any[];
        /**
         * Output sprites generated by the source.
         */
        sprites: IRenderSprites;
        /**
         * An optional filter to change colors by, if source is a "filter" command.
         */
        filter: IFilterAttributes;
        /**
         * Any containers storing this Render.
         */
        containers: IRenderContainerListing[];
        /**
         * Initializes a new instance of the Render clsas.
         *
         * @param source   The original command to create this render.
         * @param filter   An optional filter to change colors by, if source
         *                 is a "filter" command.
         */
        constructor(source: ICommand, filter?: IFilterAttributes);
    }
    /**
     * Container for multiple sprite sections of Uint8ClampedArray of data.
     */
    class SpriteMultiple implements ISpriteMultiple {
        /**
         * Storage for each internal Uint8ClampedArray sprite, keyed by container.
         */
        sprites: IClampedArraysContainer;
        /**
         * The direction of sprite, such as "horizontal".
         */
        direction: string;
        /**
         * How many pixels tall the top section is, if it exists.
         */
        topheight: number;
        /**
         * How many pixels wide the right section is, if it exists.
         */
        rightwidth: number;
        /**
         * How many pixels tall the bottom section is, if it exists.
         */
        bottomheight: number;
        /**
         * How many pixels wide the left section is, if it exists.
         */
        leftwidth: number;
        /**
         * Whether the middle section should be stretched to fill the remaining
         * space instead of filling as a pattern.
         */
        middleStretch: boolean;
        /**
         * Initializes a new instance of the SpriteMultiple class.
         *
         * @param sprites   Data for each sprite to import, keyed by container.
         * @param render   The parsed sprite source.
         */
        constructor(sprites: IClampedArraysContainer, render: IRender);
    }
}
declare var module: any;
