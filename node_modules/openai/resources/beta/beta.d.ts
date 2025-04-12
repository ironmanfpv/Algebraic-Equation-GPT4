import { APIResource } from "../../resource.js";
import * as AssistantsAPI from "./assistants.js";
import * as ChatAPI from "./chat/chat.js";
import { Assistant, AssistantCreateParams, AssistantDeleted, AssistantListParams, AssistantStreamEvent, AssistantTool, AssistantUpdateParams, Assistants, AssistantsPage, CodeInterpreterTool, FileSearchTool, FunctionTool, MessageStreamEvent, RunStepStreamEvent, RunStreamEvent, ThreadStreamEvent } from "./assistants.js";
import * as RealtimeAPI from "./realtime/realtime.js";
import { Realtime } from "./realtime/realtime.js";
import * as ThreadsAPI from "./threads/threads.js";
import { AssistantResponseFormatOption, AssistantToolChoice, AssistantToolChoiceFunction, AssistantToolChoiceOption, Thread, ThreadCreateAndRunParams, ThreadCreateAndRunParamsNonStreaming, ThreadCreateAndRunParamsStreaming, ThreadCreateAndRunPollParams, ThreadCreateAndRunStreamParams, ThreadCreateParams, ThreadDeleted, ThreadUpdateParams, Threads } from "./threads/threads.js";
import { Chat } from "./chat/chat.js";
export declare class Beta extends APIResource {
    realtime: RealtimeAPI.Realtime;
    chat: ChatAPI.Chat;
    assistants: AssistantsAPI.Assistants;
    threads: ThreadsAPI.Threads;
}
export declare namespace Beta {
    export { Realtime as Realtime };
    export { Chat };
    export { Assistants as Assistants, type Assistant as Assistant, type AssistantDeleted as AssistantDeleted, type AssistantStreamEvent as AssistantStreamEvent, type AssistantTool as AssistantTool, type CodeInterpreterTool as CodeInterpreterTool, type FileSearchTool as FileSearchTool, type FunctionTool as FunctionTool, type MessageStreamEvent as MessageStreamEvent, type RunStepStreamEvent as RunStepStreamEvent, type RunStreamEvent as RunStreamEvent, type ThreadStreamEvent as ThreadStreamEvent, AssistantsPage as AssistantsPage, type AssistantCreateParams as AssistantCreateParams, type AssistantUpdateParams as AssistantUpdateParams, type AssistantListParams as AssistantListParams, };
    export { Threads as Threads, type AssistantResponseFormatOption as AssistantResponseFormatOption, type AssistantToolChoice as AssistantToolChoice, type AssistantToolChoiceFunction as AssistantToolChoiceFunction, type AssistantToolChoiceOption as AssistantToolChoiceOption, type Thread as Thread, type ThreadDeleted as ThreadDeleted, type ThreadCreateParams as ThreadCreateParams, type ThreadUpdateParams as ThreadUpdateParams, type ThreadCreateAndRunParams as ThreadCreateAndRunParams, type ThreadCreateAndRunParamsNonStreaming as ThreadCreateAndRunParamsNonStreaming, type ThreadCreateAndRunParamsStreaming as ThreadCreateAndRunParamsStreaming, type ThreadCreateAndRunPollParams, type ThreadCreateAndRunStreamParams, };
}
//# sourceMappingURL=beta.d.ts.map