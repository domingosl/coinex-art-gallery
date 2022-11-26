import Swal from 'sweetalert2/src/sweetalert2.js';


angular.module("main", []).controller("main", [ "$scope", function ($scope, $interval) {

    $scope.showExploreModal = async () => {

        await Swal.fire({
            title: 'Explore Galleries',
            html: 'Enter the gallery address below or check out the demo. (<a href="/gallery.html?g=example1">Demo 1</a>',
            input: 'text',
            inputLabel: 'Gallery Address',
            inputValue: "",
            confirmButtonText: 'Open gallery',
            showCancelButton: false,
            inputValidator: (value) => {
                const contractAddrReg = new RegExp('^0x[a-fA-F0-9]{40}$');

                if (!contractAddrReg.test(value)) {
                    return 'Invalid gallery address';
                }

                location.href = '/gallery.html?g=' + value;
            }
        });

    };


}]);

