package com.senior.project.backend.Portfolio;

import com.senior.project.backend.domain.Artifact;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Objects;


@Component
public class ArtifactHandler {

    private final ArtifactService artifactService;

    public ArtifactHandler(ArtifactService artifactService){
        this.artifactService = artifactService;
    }

    public Mono<ServerResponse> handleFileUpload(ServerRequest request) {
        return request.multipartData()
                .map(parts -> parts.toSingleValueMap().get("file"))
                .filter(part -> part instanceof FilePart)
                .map(part -> (FilePart) part)
                .flatMap(artifactService::processFile)
                .flatMap(response -> ServerResponse.ok()
                        // https://github.com/spring-projects/spring-ws/issues/1128
                        // There seems to be a bug where you can't convert a single string to valid json
                        // return plain text instead and handle it in angular instead.
                        // Want to explicitly return plain text so if this is ever fixed in a
                        // spring update it won't break
                        .contentType(MediaType.TEXT_PLAIN)
                        .bodyValue(response));
    }


    public Mono<ServerResponse> servePdf(ServerRequest request) {
        String filename = request.pathVariable("artifactID");

        // TODO actually grab filename using id

        // Set the appropriate headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);

        Mono<ResponseEntity<Resource>> file = artifactService.getFile(filename, headers);

        return file.flatMap(responseEntity ->
                ServerResponse.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(BodyInserters.fromValue(Objects.requireNonNull(responseEntity.getBody()))));
    }

    public Mono<ServerResponse> all(ServerRequest serverRequest) {
        System.out.println("all artifacts");
        // TODO may want way to only get artifacts needed from portfolio page
        return ServerResponse.ok().body(this.artifactService.all(), Artifact.class );
    }
}
