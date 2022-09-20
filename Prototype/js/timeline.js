$(function () {
    $(".btn-delete").click(function () {
        if (confirm("Do you want to delete this item in your itinerary?")) {
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
    });
    $(".btn-save").click(function () {
        item.find(".name-value").html($("#placeName").val());
        item.find(".date-value").html($("#date").val());
        item.find(".time-value").html($("#time").val());
        item.find(".address-value").html($("#address").val());
        $(".edit-form").css("display", "none");
    });
});
