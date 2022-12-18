import fs from 'fs'

export class VideoInfo{

    private readonly _contentRange: string | undefined = undefined
    private readonly _contentLength: number | undefined = undefined
    private readonly _file: fs.ReadStream | undefined = undefined

    private readonly _filePath: string | undefined = undefined
    private readonly _fileStats: fs.Stats | undefined = undefined

    public static partialVideBuilder(): VideoInfoPartialBuilder{
        return new VideoInfoPartialBuilder();
    }

    public static fullVideoBuilder(): VideoFullBuilder{
        return new VideoFullBuilder()
    }

    constructor(contentRange: string | undefined = undefined, 
                contentLength: number | undefined = undefined, 
                file: fs.ReadStream | undefined = undefined, 
                filePath: string | undefined = undefined, 
                fileStats: fs.Stats | undefined = undefined){
        this._contentRange = contentRange
        this._contentLength = contentLength
        this._file = file
        this._filePath = filePath
        this._fileStats = fileStats
    }

    get ContentRange(): string | undefined{
        return this._contentRange
    }

    get ContentLength():number | undefined{
        return this._contentLength
    }

    get File():fs.ReadStream | undefined{
        return this._file
    }

    get FilePath(): string | undefined{
        return this._filePath
    }

    get FileStats():fs.Stats | undefined{
        return this._fileStats
    }

}

export class VideoInfoPartialBuilder{

    private _contentRange: string = ''
    private _contentLength: number = 0
    private _file: fs.ReadStream | undefined = undefined

    public contentRange(contentRange: string): VideoInfoPartialBuilder{
        this._contentRange = contentRange
        return this;
    }

    public contentLength(contentLength: number): VideoInfoPartialBuilder{
        this._contentLength = contentLength
        return this;
    }

    public file(file: fs.ReadStream): VideoInfoPartialBuilder{
        this._file = file
        return this;
    }

    public build(): VideoInfo{
        return new VideoInfo(this._contentRange, this._contentLength, this._file)
    }

}

export class VideoFullBuilder{
    
    private _filePath: string = ''
    private _fileStats: fs.Stats | undefined = undefined


    public filePath(filePath: string): VideoFullBuilder{
        this._filePath = filePath
        return this
    }


    public fileStats(fileStats: fs.Stats): VideoFullBuilder{
        this._fileStats = fileStats
        return this
    }

    public build(): VideoInfo{
        return new VideoInfo(undefined, undefined, undefined, this._filePath, this._fileStats)
    }

}