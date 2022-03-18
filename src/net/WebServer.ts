import { ViewService } from "./views/ViewService";
import express from "express";
import { Logger } from "../misc/Logger";
/**
 * Webserver object
 * @author Oste Jannick.
 * @created 2022/03/15
 */
export class WebServer extends ViewService {
  public static readonly instance: WebServer = new WebServer();

  private readonly listener = express();

  /** Listening port for webrequests. */
  public get serverPort(): Number {
    return this.listener.get("port");
  }
  public get viewEngine(): string {
    return this.listener.get("view engine");
  }
  public set viewEngine(value: string) {
    this.listener.set("view engine", value);
  }

  public get serverInfo(): object {
    return this.listener.locals.info;
  }

  public get serverName(): string {
    return this.listener.locals.info.title;
  }
  public set serverName(value: string) {
    this.listener.locals.info.title = value;
  }

  /**
   * Initialization procedure of object
   * - Initialize base class
   * - Configure server listener
   */
  private constructor() {
    super();

    this.setupListener();
  }

  /**
   * Setup listener configuration
   *
   * @psuedocode setupListener
   * - Create accesibble server info object.
   * - Assign default serverName
   * - Set JSON based request processing with a cap of 1mb.
   * - Set url based endoding processing.
   * - Set asset folder to public
   * - Set port to default port
   */
  private setupListener({ assetsFolder = "public", port = 8080 } = {}): void {
    this.listener.locals.info = {};

    this.serverName = "ExpressJS server";
    this.listener.use(express.json({ limit: "1mb" }));
    this.listener.use(express.urlencoded({ extended: true }));
    this.listener.use(express.static(assetsFolder));

    this.listener.set("port", port);
  }

  /**
   * Start listening for requests
   *
   */
  public start(): void {
    Logger.log("Starting WebServer...");
    try {
      this.bindViewEngine();
      this.listener.listen(this.serverPort, () =>
        console.log(
          `[${this.constructor.name}]: listening for requests on port ${this.serverPort}`
        )
      );
    } catch (ex) {
      if (ex instanceof Error) console.log(ex.message);
    }
  }

  /**
   * Register a POST callback for a specific endpoint to the listener
   *
   * @param endpoint absolute path on the server
   * @param event callback on POST request for endpoint
   */
  public registerPostEndpoint(endpoint: string, event: Function): void {
    Logger.log(`Attempting to assign POST callback to: ${endpoint}`);

    this.listener.post(endpoint, event as any);
  }

  /**
   * Register a GET callback for a specific endpoint to the listener
   *
   * @param endpoint
   * @param event
   */
  public registerGetEndpoint(endpoint: string, event: Function): void {
    Logger.log(`Attempting to assign GET callback to: ${endpoint}`);

    this.listener.get(endpoint, event as any);
  }

  /**
   * SetMiddleware always running for all future assigned endpoint callbacks.
   *
   * @param endpoint
   * @param event
   */
  public setMiddleware(event: Function): void {
    this.listener.use(event as any);
  }
}
