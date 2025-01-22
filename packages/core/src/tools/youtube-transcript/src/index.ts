import { Tool } from '../../base/base-tool';
import { ToolFunctionSpec } from '../../base/types';
import { YoutubeTranscript } from 'youtube-transcript';

class YoutubeTranscriptTool extends Tool{

    public identifier = "youtube_transcript_tool"
    public name = "Youtube transcript tool"
    public abilities = ["Can fetch transcript of a Youtube video"]
    public instructions: string[] = ["Fetch the transcript of the video using the fetchTranscript function"]
    public functions: ToolFunctionSpec[] = [{
        name: 'fetchTranscript',
        purpose: 'Fetch the transcription by youtube video id',
        arguments: [{
            name: 'videoId',
            description: 'ID of the youtube video. It can be found in the URL query parameter "v"',
            dataType: "string"
        }],
        response: "The entire transcript of the given youtube video"
    }]

    public functionMap = {
        'fetchTranscript': this.fetchTranscript.bind(this)
    }

    public async fetchTranscript(videoId: string){
        const response = await YoutubeTranscript.fetchTranscript(videoId);
        const string = response.map(obj => obj.text).join('\n');
        return string;
    }
}

export const youtubeTranscriptTool = new YoutubeTranscript();