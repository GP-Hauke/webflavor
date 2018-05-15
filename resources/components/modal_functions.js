function openModal(modalType, assessmentID, clickTarget) {
  var courseData = JSON.parse(localStorage.getItem(LOCAL_COURSE_DATA_ID));
  var pathStr = courseData.THEME_PATH;
  switch(modalType) {
    case 'splashPage':
      $('#modalContainer').html(getSplashPage());
      break;
    case 'glossary':
      $('#modalContainer').html(getGlossary());
      glossaryNavigate();

      break;
    case 'help':
      $('#modalContainer').html(getHelpPage());
      break;
    case 'assessment':
      $('#modalContainer').html(getAssessment());
      launchAssessment(assessmentID, clickTarget);
      break;
  }

  $('.modal').on('shown.bs.modal', function (e) {
    $('.modal .modal-body').css({height: $('.modal').height()});
  });

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function openContentModal(heading, content) {
  $('#modalContainer').html('<div class="modal fade" id="contentModal" tabindex="-1" role="dialog" aria-labelledby="contentModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="'+pathStr+'/media/img/btn_close.png" alt="close the modal"></span></button><h4 class="modal-title" id="">'+heading+'</h4></div><div class="modal-body clearfix">'+content+'</div></div></div></div>');

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function openVidModal(heading,vidSrc,posterSrc) {
  $('#modalContainer').html("<div class='modal fade' id='vidModal' tabindex='-1' role='dialog' aria-labelledby='vidModalLabel'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'><img src='"+pathStr+"/media/img/btn_close.png' alt='close the modal'></span></button><h4 class='modal-title' id=''>"+heading+"</h4></div><div class='modal-body clearfix'><video id='' src='"+vidSrc+"' preload='none' controls poster='"+posterSrc+"'>Sorry, your browser doesn't support embedded videos, but don't worry, you can <a href=''>download it</a> and watch it with your favorite video player!</video></div></div></div></div>");

  $('.modal').on('hidden.bs.modal', function (e) {
    $('#modalContainer').html('');
  });

  $('.modal').modal();
}

function getSplashPage() {
  var html = '<div class="modal" id="splashPageModal" tabindex="-1" role="dialog" aria-labelledby="splashPageModalLabel"><div class="modal-dialog" role="document" style="max-width: 1000px"><div class="modal-content"><div class="row"><div class="col-md-12"><img class="img-fluid mx-auto d-block" data-dismiss="modal" src="resources/media/img/00_splash_lg.jpg" alt="splash page image"><img class="img-fluid mx-auto d-none" data-dismiss="modal" src="resources/media/img/00_splash_sm.jpg" alt="splash page image"></div></div></div></div></div><audio autoplay><source src="resources/media/audio/0.mp3"/></audio>';
  return html;
}

/* NEW GLOSSARY METHOD USING XML */

function getGlossary() {
  var glossary = '<div class="modal fade" id="glossaryModal" tabindex="-1" role="dialog" aria-labelledby="glossaryModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><div class="modal-title-wrapper"><h4 class="modal-title" id="glossaryModalLabel">GLOSSARY</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="resources/media/img/btn_close_glossary.png" alt="close the glossary"></span></button></div><div class="alphabet"><a id="" href="#">a</a><a id="" href="#">b</a><a id="" href="#">c</a><a id="" href="#">d</a><a id="" href="#">e</a><a id="" href="#">f</a><a id="" href="#">g</a><a id="" href="#">h</a><a id="" href="#">i</a><a id="" href="#">j</a><a id="" href="#">k</a><a id="" href="#">l</a><a id="" href="#">m</a><a id="" href="#">n</a><a id="" href="#">o</a><a id="" href="#">p</a><a id="" href="#">q</a><a id="" href="#">r</a><a id="" href="#">s</a><a id="" href="#">t</a><a id="" href="#">u</a><a id="" href="#">v</a><a id="" href="#">w</a><a id="" href="#">x</a><a id="" href="#">y</a><a id="" href="#">z</a></div></div><div class="modal-body">';


  for(i = 0; i < courseData.glossary.items.length; i++){

    var term = courseData.glossary.items[i].term;
    var def = courseData.glossary.items[i].definition;
    var glossID = term.charAt(0);


    var glossItem = '<div class="gloss-item" id="'+glossID+'"><h5>'+term+'</h5><p>'+ def +'</p></div>'

    glossary += glossItem;
  }

  glossary += '</div></div></div></div>';

  return glossary;

}

function glossaryNavigate(){
  $(".alphabet a").click(function() {
    var c = '#' + $(this).text()
    console.log(c);
    console.log('offset:  ' + $(c).offset().top);

    if($(c).offset().top > 140 || 120 > $(c).offset().top){
      $('.modal-body').scrollTop(
        0
      );

      $('.modal-body').animate({
        scrollTop: $(c).offset().top - 130
      });
    }
  });
}

/* end NEW GLOSSARY METHOD USING XML */

/*
OBSOLETE getGlossary
function getGlossary() {
  var html = '<div class="modal fade" id="glossaryModal" tabindex="-1" role="dialog" aria-labelledby="glossaryModalLabel"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="glossaryModalLabel">GLOSSARY</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="resources/media/img/btn_close_glossary.png" alt="close the glossary"></span></button></div><div class="modal-body"><div class="gloss-item"><h5>172-point inspection</h5><p>The detailed criteria every eligible pre-owned GM vehicle must meet to become certified within the GM system. Every eligible vehicle that meets the basic standards must pass all 172 points, or reconditioned to meet the standards in order to become certified. This inspection is the foundation on which the Certified Pre-Owned Program is built.</p></div><div class="gloss-item"><h5>average transaction price (ATP)</h5><p>The average price for which a vehicle is likely to sell. The Certified Pre-Owned program helps keep the ATP increased, thus protecting the brand and strengthening the residual value for new, used and CPO vehicles.</p></div><div class="gloss-item"><h5>certified pre-owned (CPO)</h5><p>A pre-owned vehicle that is the current model year or previous-five model years from original in-service date, has fewer than 75,000 miles, has a clean vehicle history, has no open field actions (including recalls or campaign repairs) and has undergone a rigorous inspection and reconditioning process. These vehicles offer more than $2,800 of built-in-value, a 6-year/100,000-mile Powertrain Limited Warranty, a CPO Scheduled Maintenance Program, a vehicle exchange program and a free vehicle history report.</p></div><div class="gloss-item"><h5>Certified Pre-Owned Inventory System (CPOIS)</h5><p>A company-wide inventory system that helps participating dealers manage their own certified-pre owned vehicles as well as gain access to other vehicles throughout the company, either from other dealers or company-owned. The intuitive system allows for complete management of your inventory and is essential for completing the certification process. It provides exclusive marketing materials, such as window stickers, and shares your inventory across many online outlets. The system is offered by the GM Certified Pre-Owned Teams supporting the Chevrolet, Buick, and GMC Certified Pre-Owned Programs.</p></div><div class="gloss-item"><h5>Dealer Support Center</h5><p>Enroll in CPOIS and the Factory Pre-Owned Collection by calling 888-468-7338.</p></div><div class="gloss-item"><h5>end-of-term</h5><p>A vehicle reaching the end of its lease contract. The customer has several options to return the vehicle, buy the vehicle or institute a short-term lease or re-lease in some cases. Dealerships have the ability to purchase the vehicle to pay off the lease and add it to their inventory as well as use the vehicle as incentive to sell the buyer another vehicle.</p></div><div class="gloss-item"><h5>Factory Pre-Owned Collection (FPOC)</h5><p>A website that offers off-rental, off-lease and GM company vehicles simultaneously to consumers and on the wholesale market. Customers can shop the site, apply for financing and have their vehicle delivered directly to a participating dealer. Dealers can use the site to bid on exclusive vehicles at wholesale prices. Enroll through GlobalConnect. The Dealer Support Center can help you enroll.</p></div><div class="gloss-item"><h5>GMCertified.com</h5><p>A consumer-focused website that collects a wide array of certified pre-owned Chevrolet, Buick and GMC vehicles from participating dealerships throughout the nation. Consumers can explore the vehicles available, purchase direct to dealer through no-hassle pricing and have the vehicle delivered directly to their local participating dealership. Every CPO vehicle in your inventory is displayed on the site.</p></div><div class="gloss-item"><h5>GMF DealerSource</h5><p>GMF DealerSource is an online platform developed exclusively for GM franchise dealers that allows them to track upcoming maturities, obtain payoff quotes, ground returning vehicles and purchase pre-owned GM inventory including returned GM company car and rental vehicles, as well as GM Financial off-lease inventory. GMF DealerSource is available as a smartphone or tablet app for Android™ and Apple® users.</p></div><div class="gloss-item"><h5>grounding</h5><p>Grounding is the process of returning a leased vehicle that is 365 days or less to contract maturity. A dealer informs GM Financial that the vehicle in question has been returned and the lease contract has been ended and the vehicle rights are being transferred back to the manufacturer. Dealers can easily ground vehicles using GMF DealerSource, and can elect to keep the vehicle through an easy step-by-step process.</p></div><div class="gloss-item"><h5>investigative vehicle history (IVH) report</h5><p>A vehicle report that is accessed through GlobalConnect&apos;s Service Workbench. All certified vehicles need to have a program-compliant IVH.</p></div><div class="gloss-item"><h5>maturity viewer</h5><p>A feature of GMF DealerSource that allows the user to track and anticipate upcoming lease maturities as well as identify early-cycle opportunities.</p></div><div class="gloss-item"><h5>off-lease</h5><p>A vehicle that has reached the end of its contract and is no longer under lease. Until action is taken, the vehicle is considered owned by General Motors.</p></div><div class="gloss-item"><h5>Scheduled Maintenance Program</h5><p>CPO Scheduled Maintenance Program helps consumers keep their vehicles in top condition with GM’s no-charge scheduled maintenance. Every Certified Pre-Owned Chevrolet, Buick, and GMC vehicle comes with the 2-Year/24,000-Mile CPO Scheduled Maintenance Program with two included maintenance visits. Services performed are oil and oil filter changes, tire rotations and multi-point inspections.</p></div><div class="gloss-item"><h5>vehicle history report (VHR)</h5><p>Obtained through CARFAX&reg; or AutoCheck, the VHR is a detailed report of the vehicle&apos;s history and is provided for free to customers of CPO vehicles. All CPO vehicles must pass and have a clean history report, and that report must be made available for free to potential customers and eventual buyers. The report is an essential document to be included in the final paperwork that is passed on to the customer.</p></div></div></div></div></div>';
  return html;
}
*/

function getHelpPage() {
  var html = '<div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby=""><div class="modal-dialog" style="max-width:none" role="document"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id="helpModalLabel">HELP</h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="resources/media/img/btn_close_help.png" alt="close the help page"></span></button></div><div class="modal-body"><div class="help-section"><h5>NAVIGATION</h5><div class="help-item"><h6>TABLE OF CONTENTS</h6><img src="themes/gm_selling_skills/media/img/help_toc.png" alt="t.o.c. icon"/><p>Use this to navigate to different pages in the course.</p></div><div class="help-item"><h6>CONTENT AREA</h6><p>Content will appear here. Follow the on-screen instructions for videos or interactives. Some pages may scroll.</p></div><div class="help-item"><h6>PAGE COUNT</h6><img src="themes/gm_selling_skills/media/img/help_page_count.png" alt="page count screen shot"/><p>Check your progress through the course.</p></div><div class="help-item"><h6>BACK/NEXT BUTTONS</h6><img src="themes/gm_selling_skills/media/img/help_back_next.png" alt="page count screen shot"/><p>Use these buttons to move forward or backward in the course.</p></div></div><div class="help-section"><h5>HELP</h5><div class="help-item"><h6>HELP</h6><img src="themes/gm_selling_skills/media/img/help_help.png" alt="page count screen shot"/><p>This page describes how to use the course.</p></div></div></div></div></div></div>';
  return html;
}

function getAssessment() {
  var html = '<div class="modal" id="assessmentModal" tabindex="-1" role="dialog" aria-labelledby="assessmentModalLabel" data-backdrop="static"><div class="modal-dialog" role="document" style="max-width: 1000px"><div class="modal-content"><div class="row"><div class="col-md-12 assessment-container"></div></div></div></div></div>';
  return html;
}
