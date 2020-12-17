aws lambda invoke \
    --function-name arn:aws:lambda:eu-west-1:382245405298:function:aluca-test-lambda \
    --invocation-type RequestResponse \
    outfile.txt \
	--profile profile_specula