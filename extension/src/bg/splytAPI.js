var Splyt = function(api) {
    //Host URL for JSON rest API
    this.api = api;
}

Splyt.prototype.Friend = function() {
    var self = this;
    // return {
    //     GET: function(args, callback) {
    //         console.log(self);
    //         //args.domain
    //         console.log(args.page);
    //         var params = ''
    //         if (args.id) {
    //             params = '?id=' + args.id
    //         }
    //         $.ajax({
    //             url: self.api + '/api/pages/' + args.page + params,
    //             dataType: 'json',
    //             success: function(data) {
    //                 console.log(data);
    //                 callback(null, data)
    //             },
    //             error: function(xhr, status, err) {
    //                 console.error(status, err.toString());
    //                 callback(err.toString())
    //             }
    //         });

    //     },
    //     POST: function POST(args,callback) {
    //         $.ajax({
    //             type: "POST",
    //             url: self.api + '/api/pages/',
    //             data: args,
    //             success: function(data) {
    //                 console.log(data);
    //                 callback(null, data)
    //             },
    //             error: function(xhr, status, err) {
    //                 console.error(status, err.toString());
    //                 callback(err.toString())
    //             },
    //             dataType: 'json'
    //         });
    //     },
    //     UPDATE: function UPDATE() {

    //     },
    //     DELETE: function DELETE() {

    //     }
    // }
}
