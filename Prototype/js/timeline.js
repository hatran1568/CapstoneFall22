$(function () {
    $(".btn-delete").click(function () {
        if (confirm("Do you want to delete this activity in your itinerary?")) {
            $(this).closest(".timeline-item").css("display", "none");
        }
    });

    var item;
    $(".btn-edit").click(function () {
        item = $(this).closest(".timeline-item");
        $(".edit-form").css("display", "block");
    });
    $(".btn-off").click(function () {
        $(".edit-form").css("display", "none");
        $(".add-form").css("display", "none");
    });
    $("#btnAdd").click(function(){
        $(".add-form").css("display", "block");
    });
    $("#addBtnSave").click(function(){
        var startTime = $("#timeAdd").val();
        let dateStart = new Date($('#dateAdd').val().toString()+'T'+ $('#timeAdd').val().toString())
        let dateEnd = new Date(dateStart.valueOf())
        dateEnd.setTime(dateEnd.getTime() + ($('#durationAdd').val()*60*60*1000));
        var endTime = String(dateEnd.getHours()).padStart(2, '0') + ":" + String(dateEnd.getMinutes()).padStart(2, '0');
        console.log(startTime);
        $(".timeline").children(".timeline-item").each(function(){
            var startTimeItem = $(this).find(".time-value").html().split(" - ")[0];
            if (startTimeItem >= startTime){
                var item = $(".timeline li:first").clone();
                item.find(".name-value").html($("#placeNameAdd").val());
                item.find(".date-value").html($("#dateAdd").val());
                item.find(".address-value").html($("#addressAdd").val());
                item.find("time-value").html(startTime + " - " + endTime);
                $(this).after(item);
                return false;
            }
            
        });
        $(".add-form").css("display", "none");
    });
    $(".btn-save").click(function () {
        item.find(".name-value").html($("#placeName").val());
        item.find(".date-value").html($("#date").val());
        item.find(".time-value").html($("#time").val());
        item.find(".address-value").html($("#address").val());
        $(".edit-form").css("display", "none");
    });
});
