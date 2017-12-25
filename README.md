# Small Talk
Process should talk to each other more.

## Installation
`npm install @tamatashwin/small-talk`

## Usage
First, call the module to get an instance of small talk.
```javascript
var smallTalk = require('small-talk')();
```

There are:
* Start
* Respond

### Start
The start function begins the 'conversation' between, in this example, the parent and the child process.
```javascript
smalltalk.start('a_name', child_process, function () {
  return "data to be sent.";
})
```

### Respond
The respond function replies to a 'conversation' started by the *Start Function*.
```javascript
smalltalk.respond('a_name', parent_process, function (data) {
  return data += "\nMore data sent in reply to the data sent here originally.";
})
```

### Replies
Use any number of `reply` to keep the conversation going.
```javascript
.reply(function (data) {
  return "Data can be sent back and forth.";
})
.reply({
  object: "sent",
  as: "data"
})
.reply(1)
.reply(function (data) {
  return "Each chained function/data is called incrementally as there are replies from the parent/child process."
})
```

### Done
Once the conversation is to be finished, call done. It should be noted, the conversation will not start until done is called in this version.
```javascript
.done() // The Conversation will execute now
```

## API
### smallTalk()
**Description**:

This will initiate an instance of small talk.

**Syntax**:

`smallTalk(interval)`

| Parameter | Type | Description |
| --- | --- | --- |
| **interval** | Number | The retry interval for the processes trying to connect in milliseconds. No conversations start between them till they connect. It must be a number greater than 0. *Defaults to 100.* |

### *smallTalk*.start()
**Description**:

The start function begins the 'conversation'. It must call `.done()` for the conversation to begin.

**Syntax**:

`smallTalk.start(name, process, data)`

| Parameter | Type | Description |
| --- | --- | --- |
| *name* | String | This string describes the name of this conversation. It must be unique to every conversation. |
| *process* | Process Object | An object with *send* and *on* functions. |
| * data* | Any type*| This parameter should contain the data that is first sent over as a reply to the first message received from the parent. If a function is passed through, it is first called and the returned object is sent. |

**Return**:
[Talk Instance]

### *smallTalk*.respond()
**Description**:

The respond function is the 'conversing' partner of the start function. Call it from the other part of the process.

**Syntax**:

`smallTalk.respond(name, process, data)`

| Parameter | Type | Description |
| --- | --- | --- |
| *name* | String | This string describes the name of this conversation. It must be unique to every conversation. |
| *process* | Process Object | An object with *send* and *on* functions. |
| * data* | Any type*| This parameter should contain the data that is first sent over to the child. If a function is passed through, it is first called and the returned object is sent. |

**Return**:

[Talk Instance]

### new Talk()
**Description**:

The `smallTalk.start()` and `smallTalk.respond()` functions both return an instance of Talk();
Talk has the following methods. The rest is internal, so out of the scope of this document for now:
* reply
* done

#### *new Talk()*.reply()
**Description**:

This method describes what to reply in response to a message from the `proc`. They are completed one by one, hence futher calls from the `proc` will call subsequent functions/data passed in through reply.

**Syntax**:

`new Talk().reply(f)`

| Parameter | Type | Description |
| --- | --- | --- |
| f | Any Type* | This parameter should contain the data that is sent over as a reply to the message received from the parent. If a function is passed through, it is first called and the returned value is sent. |

**Return**:

[Talk Instance] [talk] - The same talk instance, so more replies can be chained.

#### *new Talk()*.done()
**Description**:

This method, when called signifies the end of the  conversation. It is only after calling this function on the start and the respond that they will connect and have their conversation. No replies can be chained after this function is called.

**Syntax**:
`new Talk().done()`

**Return**:

undefined
