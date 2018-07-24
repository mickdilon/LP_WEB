$(document).ready(function () {
    $('#carouselUnitec').hammer().on('swipeleft', function () {
        $(this).carousel('next');
    })
    $('#carouselUnitec').hammer().on('swiperight', function () {
        $(this).carousel('prev');
    })

    //animate for steppers
    $("ul.stepper li").on("click", function(){
        $("ul.stepper li").removeClass( "active" );
        $(this).addClass( "active" );
    })

    //next stepper button   
    $(".nextSeccion").on("click", function(e){
        $lipadre = $(this).parent().parent();
        $("ul.stepper li").removeClass( "active" );
        $lipadre.next().addClass("active");
        $lipadre.find("a span:nth-child(1)").addClass("listo");
        $("span.listo").html("<i class='fa fa-check' aria-hidden='true'></i>");
        return false;
    })
    $("#carouselUnitec").carousel({ interval : false });
    
});