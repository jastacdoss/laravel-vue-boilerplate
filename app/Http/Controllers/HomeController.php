<?php

namespace App\Http\Controllers;

use App\Traits\RestControllerTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use App\Ticker;

class HomeController extends Controller
{
    use RestControllerTrait;

    public function index()
    {
        // Fetch the current ticker
        $client = new Client();
        $result = $client->get('https://api.pro.coinbase.com/products/ETH-USD/ticker');
        $ticker = (array) json_decode($result->getBody());

        // Remove unnecessary fields
        unset($ticker['trade_id'], $ticker['time']);

        // Create the ticker
        Ticker::create($ticker);

        // Return the last ticker
        return $result;
    }

    /**
     * Show the admin dashboard
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function home()
    {
        return view('admin/index');
    }
}
