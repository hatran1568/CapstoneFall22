$(function () {
    $(".btn-delete").click(function () {
        if (confirm("Do you want to delete this item in your itinerary?")) {
            $(this).closest(".timeline-item").css("display", "none");
        }
    });
    $(".btn-edit").click(function () {
        $(".edit-form").css("display", "block");
    });
    $(".btn-off").click(function () {
        $(".edit-form").css("display", "none");
    });
});
