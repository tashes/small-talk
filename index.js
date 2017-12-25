module.exports = function (interval) {
  var SmallTalk = {};

  var THREADS = {};
  var RETRY_INTERVAL = (interval > 0 ? interval : 100) || 100;

  function startSmallTalk (name, p) {
    if (THREADS[name].length > 0) {
      var fx = THREADS[name].shift();
      if (typeof fx === "function") {
        fx = data();
      }
      p.send({
        id: name + '__smalltalk',
        data: fx
      });
    }
  };

  function Talk (name, p, f, s) {
    // State
    this.state = false;
    this.partnerState = false;
    this.partnerMessage = false;
    // Process
    this.p = p;
    // Starter
    this.s = s;
    // Id
    this.id = name;
    THREADS[this.id] = [];

    // Add Function
    if (f) THREADS[this.id].push(f);

    // Set up listener
    p.on('message', (data) => {
      if (data && data.id) {
        if (data.id == (this.id + "__smalltalk_state")) {
          this.partnerState = true;
          if (typeof this.partnerMessage !== "boolean") clearInterval(this.partnerMessage);
          this.partnerMessage = true;
        }
      }
    });
    // add universal listener
    p.on('message', (data) => {
      if (data && data.id) {
        if (data.id === name + '__smalltalk') {
          if (THREADS[name].length > 0) {
            var fx = THREADS[name].shift();
            if (typeof fx === "function") {
              fx = fx(data.data);
            }
            p.send({
              id: name + '__smalltalk',
              data: fx
            });
          }
        }
      }
    });

    return this;
  };
  Talk.prototype = {
    reply: function (f) {
      THREADS[this.id].push(f);
      return this;
    },
    done: function () {
      if (!this.state) {
        // set up and run
        this.state = true;
        if (!this.partnerState) {
          this.p.send({
            id: this.id + "__smalltalk_state"
          });
          this.partnerMessage = setInterval(() => {
            this.p.send({
              id: this.id + "__smalltalk_state"
            });
          }, RETRY_INTERVAL);
        }
        if (this.s) {
          if (this.partnerState) {
            // Start Small Talk
            startSmallTalk(this.id, this.p);
          }
          else {
            // Retry after RETRY_INTERVAL
            var int = setInterval(() => {
              // Check again
              if (this.partnerState) {
                startSmallTalk(this.id, this.p);
                clearInterval(int);
              }
            }, RETRY_INTERVAL);
          }
        }
      }
    }
  };

  SmallTalk.start = (name, p, f) => {
    return new Talk(name, p, f, true);
  };
  SmallTalk.respond = (name, p, f) => {
    return new Talk(name, p, f, false);
  };

  return SmallTalk;
};
