$(function(){
    $(".btn-delete").click(function(){
        if(confirm("Do you want to delete this item in your itinerary?")){
            $(this).closest(".timeline-item").css("display", "none");
        }
    });
});