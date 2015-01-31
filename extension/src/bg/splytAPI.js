var Splyt = function(api) {
    //Host URL for JSON rest API
    this.api = api;
}

//Good to think of the 'args' argument as being sent straight from the client. Background is only a buffer.
Splyt.prototype.Endpoint = function() {
    var self = this;
    return {
        GET: function(args, callback) {
            console.log(args);
            $.ajax({
                url: self.api + '/api/endpoint/',
                dataType: 'json',
                success: function(data) {
                    console.log(data);
                    callback(null, data)
                },
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                    callback(err.toString())
                }
            });

        },
        POST: function POST(args,callback) {
            $.ajax({
                type: "POST",
                url: self.api + '/api/endpoint/',
                data: args,
                success: function(data) {
                    console.log(data);
                    callback(null, data)
                },
                error: function(xhr, status, err) {
                    console.error(status, err.toString());
                    callback(err.toString())
                },
                dataType: 'json'
            });
        },
        UPDATE: function UPDATE() {

        },
        DELETE: function DELETE() {

        }
    }
}

Splyt.prototype.soundcloud_get = function() {
  var self = this;
  return {
    GET: function(args, callback) {

    }
  }
}
